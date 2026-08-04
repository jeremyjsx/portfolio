---
title: Go workers, queues, and the boring parts of scale
date: 2026-01-18
status: published
excerpt: Reliable background work beats clever concurrency every time.
---

Background work is where backend systems stop being CRUD apps and start being systems. Go is a good fit here: small binaries, clear concurrency primitives, and a standard library that stays out of the way.

## A worker loop that fails safely

```go
for {
    job, err := queue.Lease(ctx)
    if err != nil {
        time.Sleep(backoff)
        continue
    }

    if err := handle(ctx, job); err != nil {
        queue.Nack(ctx, job, err)
        continue
    }

    queue.Ack(ctx, job)
}
```

The details matter more than the loop:

- **Lease timeouts** so crashed workers do not hold jobs forever.
- **Poison message handling** after N failures.
- **Structured logs** with job ID and attempt count.

## Backpressure beats heroics

When downstream APIs slow down, workers should slow down too. Unlimited goroutines feel fast in development and painful in production.

## What I optimize for

1. Observable retries.
2. Idempotent handlers.
3. A dashboard that answers: "what is stuck right now?"

Queues are not exciting. Reliable queues are how products keep their promises.
