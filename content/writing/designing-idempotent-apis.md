---
title: Designing idempotent APIs that survive retries
date: 2026-03-12
status: published
excerpt: Make retries safe so duplicate requests don't double-charge or double-write.
---

Clients retry. Networks drop. Load balancers replay requests. If your API treats a duplicate call as a new operation, you will eventually ship money twice, send two emails, or create two records that should have been one.

## Start with a stable idempotency key

Give callers a header they can reuse across retries:

```http
POST /payments
Idempotency-Key: pay_01j8k3m2n4p5q6r7s8t9
Content-Type: application/json

{ "amount": 1200, "currency": "USD" }
```

Store the key with the final response. A repeat request with the same key should return the **same outcome**, not re-run side effects.

## What to persist

At minimum:

- idempotency key
- request hash (optional but useful)
- response status + body
- created timestamp

> The goal is not to block duplicates forever. It is to make retries safe for a reasonable window.

## Common mistakes

1. Generating keys on the server instead of accepting them from the client.
2. Returning `409` when you should return the original `201` response.
3. Only protecting creates, not updates that trigger downstream work.

## Closing thought

Idempotency is one of those backend details that feels boring until an incident proves it was the whole product. Design for retries first; your on-call future self will thank you.
