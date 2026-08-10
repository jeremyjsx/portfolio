---
title: How idempotency saved my payment API
date: 2026-03-12
status: published
excerpt: Frontend retries were coming. Without idempotency keys, a payment API would have charged people twice.
---

This is not a theory post. It is the near-miss I still think about when someone says "we'll just add retries on the client."

I was shipping a payment-related API. Create a charge, wait for the provider, return success. On a good day the path was clean. On a bad day the network lied, the tab froze, or the load balancer cut the connection after the money had already moved.

Then the frontend plan landed: retry failed requests with exponential backoff.

That sentence is fine for a `GET`. For a `POST` that takes money, it is how you invent double charges.

## What almost happened

Picture the race without protection:

1. User taps Pay.
2. Browser sends `POST /payments`.
3. Your API creates the payment with the provider. Success.
4. The response never reaches the client (timeout, flaky Wi‑Fi, proxy blip).
5. The client assumes failure and retries. Backoff: 1s, 2s, 4s...
6. Your API happily creates payment number two.

Same user. Same amount. Two charges. Support ticket. Refund. Trust dent.

I had not waited for the frontend PR to merge before adding idempotency. That timing was luck, not virtue. If retries had shipped first, production would have taught the lesson the expensive way.

## Why payment APIs are special

Reads are mostly safe to replay. Writes that trigger the real world are not:

- charging a card
- capturing a hold
- issuing a refund
- transferring inventory
- sending a confirmation email tied to "payment succeeded"

Payment providers themselves lean on idempotency for the same reason. Your API sits between a nervous client and a money movement. If you do not define what "same request again" means, the client will invent a definition by hammering retry.

## Retry logic is not the villain

Retries are correct engineering. Networks drop. Mobile users background the app. Gateways time out while your upstream is still working.

Exponential backoff is even polite: it stops a thundering herd from finishing what a single timeout started.

The bug is pairing **automatic retries** with **non-idempotent writes**. The client cannot know whether the first request died before or after your side effects. So it retries. Your job is to make that retry boring.

## Idempotency keys

Give the client a key it can reuse across attempts for the same logical action:

```http
POST /payments
Idempotency-Key: pay_01j8k3m2n4p5q6r7s8t9
Content-Type: application/json

{ "amount": 1200, "currency": "USD", "orderId": "ord_42" }
```

On first sight of that key:

- run the payment
- store the key with the outcome (status, body, maybe a request hash)
- return the response

On a repeat with the same key:

- do **not** charge again
- return the **same** outcome you already produced

The frontend can retry until it gets a response. The backend treats attempts 2 through N as "show me what I already did."

> [!IMPORTANT] Keys come from the client
>
> If the server generates a new key per request, every retry is a new payment. The browser (or mobile app) must mint the key once per user action and reuse it for the whole retry chain.

## What I stored

Bare minimum that saved me:

- idempotency key (unique per scope, usually per user or account)
- final HTTP status + response body
- created-at (and a TTL window so keys do not live forever)

Optional but useful: a hash of the request body. Same key with a different payload should fail loudly (`409` or similar), not silently apply the old result to new input.

When a duplicate arrived after the frontend retries shipped, the path looked successful to the UI and empty of new side effects on my side. That is the whole point.

## The order that matters

If I replay the timeline, the safe order was:

1. Make the write path idempotent.
2. Then let the client retry with backoff.

Reverse that order and you are load-testing double charges with real users.

> [!TIP] Ship the boring guard first
>
> Retries feel like a frontend polish ticket. Idempotency feels like a backend chore. Schedule the chore before the polish. Your future on-call self is not a vibe.

## Closing

Idempotency did not make the API clever. It made retries safe.

Payment APIs, retry logic, and idempotency keys are the same story told from three chairs. The network will fail. The client will try again. Your API either understands "again" or it invents a second payment.

I got lucky on the calendar. Design like you will not.
