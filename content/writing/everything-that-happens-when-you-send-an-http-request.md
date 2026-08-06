---
title: Everything that happens when you send an HTTP request
date: 2026-04-16
status: published
excerpt: Follow a request from the browser through DNS, TCP, TLS, proxies, your app, and the database.
---

You click a button. A spinner shows up. JSON comes back. Done.

Except it is not done. Between "click" and "200 OK" there is a whole chain of systems that have to agree, in order, or your request never arrives. This post follows a request from the browser through DNS, TCP, TLS, a load balancer, a reverse proxy, your application, and the database, then back out as a response.

Not every product has every box (some skip a separate reverse proxy, some talk to more than one database), but this is the shape you will keep meeting in production.

![Diagram of a request from the browser through DNS, TCP, TLS, load balancer, and reverse proxy to the application and database. The HTTP response returns through the same edge and connection.](/images/writing/http-request-path.png)

*What happens when you type a URL. Response returns through the same edge and connection.*

> [!NOTE] Read this like a map
>
> You do not need to memorize packet layouts. You need a mental model of the chain, because real outages hide three boxes away from your handler.

## Browser

It starts in the client. The browser (or mobile app, or `curl`, or another service) builds an HTTP request: method, URL, headers, maybe a body.

A few things happen before anything leaves your machine:

- **URL parsing.** Scheme (`https`), host (`api.example.com`), path (`/orders`), query string (`?page=2`).
- **Cache checks.** For GETs, the browser may serve from disk/memory cache if headers allow it. If you are debugging "why is my API not hit," check whether the browser never left.
- **Connection reuse.** HTTP/1.1 keep-alive and HTTP/2 multiplexing mean a new click does not always mean a brand new TCP connection. Connection pools matter more than people think.
- **Cookie and auth headers.** Session cookies, `Authorization` tokens, CSRF headers. The browser attaches what the site previously set, under cookie rules (domain, path, `Secure`, `HttpOnly`, `SameSite`).

> [!TIP] Cache before you blame DNS
>
> For GETs, open DevTools and confirm the request actually left the browser. A disk cache hit looks like "API is fine" while you stare at empty access logs.

Then the browser needs an IP address for the host. That is DNS.

## DNS

DNS turns `api.example.com` into one or more IP addresses.

Rough flow:

1. Check the local stub resolver / OS cache.
2. If miss, ask a recursive resolver (often your ISP or `1.1.1.1` / `8.8.8.8`).
3. That resolver walks the hierarchy as needed: root → TLD (`.com`) → authoritative nameservers for `example.com`.
4. You get an answer: A/AAAA records, sometimes a CNAME chain first, plus a TTL telling caches how long to keep it.

Why this matters for APIs:

- **TTL and cutovers.** Low TTL helps failover and blue/green DNS flips. High TTL means clients keep old IPs longer after you move.
- **Multiple answers.** Round-robin A records are a blunt load-distribution tool. They are not a substitute for a real load balancer health check.
- **Failures look weird.** Slow DNS feels like a hung request. Wrong DNS feels like "site is down" when the app is fine.

Once you have an IP and a port (443 for HTTPS), you need a connection.

## TCP

HTTP (as we usually ship it) rides on TCP. TCP gives you a reliable, ordered byte stream between two sockets.

The handshake in three packets:

1. Client → server: `SYN` ("I want to talk").
2. Server → client: `SYN-ACK` ("OK, here are my sequence numbers").
3. Client → server: `ACK` ("We're connected").

Then data can flow. TCP also handles retransmission, congestion control, and ordering. Packet loss does not always mean "request failed"; it can mean "this got slower while TCP recovered."

Details that show up in real outages:

- **Connection timeouts.** If the SYN never gets an answer (firewall drop, wrong IP, dead host), the client waits until its connect timeout.
- **Slow start.** A brand new connection starts conservative. Short APIs on cold connections pay a latency tax that keep-alive / HTTP/2 avoid.
- **Half-open and resets.** Load balancers and NAT devices sometimes kill idle connections. Your client retries; your server might see a duplicate if you are not careful higher up.

For HTTPS, you do not send plaintext HTTP yet. Next comes TLS.

## TLS

TLS wraps the TCP stream so eavesdroppers cannot read or silently modify the bytes.

Classic TLS 1.2 flow (simplified):

1. ClientHello (supported versions, cipher suites, SNI hostname, maybe ALPN for HTTP/2).
2. ServerHello + certificate chain.
3. Key exchange so both sides derive shared secrets.
4. Finished messages; then encrypted application data.

TLS 1.3 is shorter and safer by default (fewer round trips, old weak options removed). With session resumption or 0-RTT, repeat connections get cheaper. 0-RTT has replay caveats, so APIs that mutate state should understand that tradeoff.

What you should actually remember:

- **SNI** tells the server which certificate to present when many sites share one IP.
- **Certificate validation** (chain, expiry, hostname) is why "works on my machine" and corporate MITM proxies create chaos.
- **ALPN** negotiates HTTP/1.1 vs HTTP/2 (vs HTTP/3 on QUIC, which is a different transport story).

Only after TLS is up do we send the HTTP request bytes: something like `GET /orders HTTP/1.1` plus headers, then the body if any.

## Load balancer

In production, clients rarely hit your app process directly. They hit a load balancer: a stable VIP (virtual IP) or hostname that forwards to healthy backends.

Jobs a load balancer usually owns:

- **Terminate or pass through TLS.** Edge TLS termination is common so backends speak HTTP on a private network. Pass-through keeps end-to-end encryption but pushes certs further in.
- **Health checks.** Remove bad instances from rotation before users notice.
- **Algorithms.** Round robin, least connections, latency-based, weighted. Sticky sessions if you must (prefer stateless apps instead).
- **L4 vs L7.** L4 balances TCP connections. L7 understands HTTP: path-based routing, header rules, WAF features, request-level metrics.

When the load balancer picks a target, your request moves closer to the app. Often the next hop is a reverse proxy on the same box or just in front of the app fleet.

## Reverse proxy

A reverse proxy (NGINX, Envoy, Caddy, Traefik, cloud equivalents) sits in front of application servers and speaks HTTP on both sides.

Typical responsibilities:

- **TLS termination** (if the load balancer did not already).
- **Routing.** `/api` to service A, `/` to the web app, gRPC elsewhere.
- **Compression, buffering, request size limits.**
- **Retries and timeouts** toward upstreams (careful: retries on non-idempotent methods can double-charge without idempotency keys).
- **Auth gates / mTLS** between services.
- **Access logs** with latency, status, upstream.

> [!WARNING] Proxies love retries
>
> A reverse proxy that retries `POST /payments` for you is doing you a favor until it is not. If the upstream committed and the response died on the way back, a blind retry creates a second charge. Idempotency keys exist for this exact mess.

The proxy opens (or reuses) a connection to an application worker and forwards the request, often adding headers like `X-Forwarded-For`, `X-Forwarded-Proto`, and a request ID. Your app should trust those only from known proxies.

## Application

Now your code runs.

A typical request handler path:

1. **Accept** the connection / read the HTTP request off the server framework.
2. **Middleware.** Request ID, logging, authn/authz, rate limits, body parsing, validation.
3. **Route** to a controller or handler.
4. **Business logic.** Create an order, fetch a profile, enqueue a job.
5. **Talk to dependencies.** Database, cache, object storage, other HTTP APIs, a queue.

This is where most "API design" lives: status codes, error shapes, idempotency, pagination, timeouts to dependencies, and making sure a client retry does not create two rows.

Important timing detail: the client is still waiting. Every DB query, every Redis hop, every internal HTTP call adds to the user's latency budget. Timeouts should be smaller as you go deeper so a stuck database does not pin every proxy worker above it.

## Database

If the handler needs durable state, it sends a query (SQL, wire protocol for Postgres/MySQL, document API for Mongo, etc.) over yet another connection from a pool.

What happens inside:

- **Parse / plan / execute** the query.
- **Locks and isolation.** Who else is writing the same row?
- **Commit.** Until commit succeeds, other transactions may not see your write (depending on isolation level).
- **Replication lag** (if you read from replicas). A read-after-write on a lagging replica looks like "my insert vanished."

Connection pools matter here the same way keep-alive mattered at the edge: opening a new DB connection per request will melt you under load.

> [!IMPORTANT] Pools beat cleverness
>
> Most "database is slow" tickets under load are really "we exhausted the pool and started waiting for a checkout." Cap concurrency, size pools on purpose, and put timeouts on queries before the proxy times out first.

When the query returns, the application builds an HTTP response: status, headers, body.

## Response

The response walks back up the same conceptual path, often on the same TCP/TLS connection: the database result becomes an HTTP response in the app, the reverse proxy may compress or log it, the load balancer hands it back toward the client, and the browser parses the status and body to update the UI.

A few response details worth caring about:

- **Status codes.** `2xx` success, `4xx` client problem, `5xx` server problem. Do not hide application errors behind a generic `200` with `{ "ok": false }` unless you have a strong reason and consistent clients.
- **Caching headers.** `Cache-Control`, `ETag`, `Vary`. Wrong caching is a production incident that looks like "API bug."
- **Streaming vs buffered.** Large responses may flush in chunks. Proxies that buffer can change memory and TTFB behavior.
- **Connection reuse.** The TCP/TLS session may stay open for the next request.

If anything in the chain fails, the failure mode depends on *where* it failed: DNS timeout, TCP timeout, TLS handshake error, `502` from proxy to dead upstream, `504` gateway timeout, `500` from your app, or a client abort when the user navigates away.

## Putting it together

Next time a request is "slow" or "flaky," ask which hop is sick:

| Symptom vibe | Often the hop |
| --- | --- |
| Instant fail, wrong host | DNS / bad URL |
| Long hang, then connect error | TCP / firewall / dead VIP |
| Certificate warnings | TLS |
| `502` / `503` / `504` | Load balancer or reverse proxy ↔ app |
| `5xx` with your error body | Application |
| App fine, data weird or slow | Database / pool / locks / replica lag |

You do not need to memorize packet layouts. You do need a mental model of the chain, because every serious backend eventually debugs a problem that was not "in the handler," it was three boxes earlier.

Click again. Same button. Now you know what you just woke up.
