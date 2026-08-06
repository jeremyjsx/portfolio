## Overview

Orderly is an e-commerce backend built to handle catalog, checkout, and order lifecycle without turning every feature into a synchronous bottleneck.

## The problem

Early versions of e-commerce APIs often mix admin flows, customer flows, and fulfillment in one service layer. Retries duplicate charges, inventory drift shows up under load, and "real-time tracking" becomes polling endpoints.

## Approach

- **Domain boundaries** for catalog, cart, orders, and notifications.
- **Role-based auth** separating customer, staff, and system actors.
- **Async workers** for emails, inventory reconciliation, and status propagation.
- **Idempotent order creation** so client retries do not create duplicate orders.

```python
# Simplified idempotency guard
def create_order(idempotency_key: str, payload: OrderCreate) -> Order:
    existing = repo.find_by_key(idempotency_key)
    if existing:
        return existing
    return repo.create(idempotency_key=idempotency_key, **payload)
```

## Outcome

A backend shape that stays understandable as features grow: HTTP for commands, workers for side effects, and explicit order state instead of implicit side channels.

## Stack notes

Python for fast iteration on business rules, with clear module boundaries so hot paths can be optimized or extracted later.
