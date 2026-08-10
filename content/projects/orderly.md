# Orderly

Orderly is a FastAPI e-commerce backend: catalog, cart, checkout, orders, and the parts that usually get bolted on later - async payment work, live tracking, and role-aware access. Auth, products, cart, and orders sit as clear modules. Payment retries and delivery updates move through RabbitMQ and WebSockets so the checkout request stays a command, not a kitchen of side effects.

## Checkout returns; payment continues

`create_order_from_cart` does the synchronous job: validate the cart, lock stock, write the order as `pending`, attach shipping, clear the cart, commit. Then it publishes `order.created` and returns.

Charging lives in `app/events/payments/` - a separate consumer. The API answers “order accepted.” Status bumps, retries, and provider talk happen after that response is already gone.

That cut matters more than the brand of queue. One handler that authenticates, decrements stock, charges, emails, and updates tracking inside a single timeout forces every failure into the customer’s wait. Pulling payment into a worker keeps those failure modes where they belong.

<!-- MEDIA_SLOT: orderly-1 -->

## Retries and the dead-letter queue

The payment consumer binds `order_created` to the `orderly_events` exchange, with a dead-letter exchange and `order_created_dlq`. Prefetch is 5. On `order.created` it runs payment processing; on success it moves the order to `processing` and publishes `payment.processed`.

Poison payloads reject without requeue. Transient failures use `x-retry-count` up to `MAX_RETRY_ATTEMPTS = 3`, with backoff at `1s`, `2s`, `4s`. After that, the message lands in the DLQ where you can inspect it instead of looping forever. Redelivery is guarded so a finished `event_id` does not double-apply.

Accept the order. Process payment out of band. Retry the flaky bits. Park the rest somewhere visible.

<!-- MEDIA_SLOT: orderly-2 -->

## State machine on the wire

Orders use explicit transitions:

- `pending` → `processing` | `cancelled`
- `processing` → `shipped` | `cancelled`
- `shipped` → `delivered`
- `delivered` / `cancelled` → nowhere

Payment success moves `pending` → `processing`. Drivers claim deliveries and flip to `shipped`. Cancel restores stock. Illegal jumps raise instead of quietly overwriting a flag.

Tracking goes over WebSockets - status changes and driver location - so clients are not stuck polling `/orders/{id}`. HTTP owns commands. The socket owns “something changed.”

Roles match the surfaces: **USER** checks out, **ADMIN** manages catalog and sees all orders, **DRIVER** claims deliveries.

<!-- MEDIA_SLOT: orderly-3 -->

## Around the hot path

JWT and Argon2 auth, sliding-window rate limits, product and category CRUD with Redis invalidation on writes, Alembic migrations, correlation IDs, Prometheus metrics, and Grafana in the Compose stack. Useful scaffolding so the checkout → worker → socket path stays runnable end to end.
