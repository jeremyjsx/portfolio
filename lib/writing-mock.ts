import type { EntriesPost } from "@/lib/entries";

export const mockWritingPosts: EntriesPost[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Designing idempotent APIs that survive retries",
    slug: "designing-idempotent-apis",
    s3_key: "posts/designing-idempotent-apis.md",
    status: "published",
    created_at: "2026-03-12T10:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Postgres indexes I actually keep in production",
    slug: "postgres-indexes-in-production",
    s3_key: "posts/postgres-indexes-in-production.md",
    status: "published",
    created_at: "2026-02-03T10:00:00.000Z",
    updated_at: "2026-02-03T10:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Go workers, queues, and the boring parts of scale",
    slug: "go-workers-and-queues",
    s3_key: "posts/go-workers-and-queues.md",
    status: "published",
    created_at: "2026-01-18T10:00:00.000Z",
    updated_at: "2026-01-18T10:00:00.000Z",
  },
];

export const mockWritingContent: Record<string, string> = {
  "designing-idempotent-apis": `# Designing idempotent APIs that survive retries

Clients retry. Networks drop. Load balancers replay requests. If your API treats a duplicate call as a new operation, you will eventually ship money twice, send two emails, or create two records that should have been one.

## Start with a stable idempotency key

Give callers a header they can reuse across retries:

\`\`\`http
POST /payments
Idempotency-Key: pay_01j8k3m2n4p5q6r7s8t9
Content-Type: application/json

{ "amount": 1200, "currency": "USD" }
\`\`\`

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
2. Returning \`409\` when you should return the original \`201\` response.
3. Only protecting creates, not updates that trigger downstream work.

## Closing thought

Idempotency is one of those backend details that feels boring until an incident proves it was the whole product. Design for retries first; your on-call future self will thank you.
`,

  "postgres-indexes-in-production": `# Postgres indexes I actually keep in production

Indexes are easy to add and expensive to keep wrong. These are the patterns I reach for after shipping a few services on Postgres.

## The default toolkit

| Pattern | When I use it |
| --- | --- |
| B-tree on foreign keys | Almost always |
| Composite \`(tenant_id, created_at DESC)\` | List endpoints with filters |
| Partial index on \`status = 'open'\` | Queues and workflow tables |
| GIN on \`jsonb\` | Only when query plans prove it |

## A composite index example

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_tenant_created
  ON orders (tenant_id, created_at DESC);
\`\`\`

If the query always filters by \`tenant_id\` and sorts by newest first, this usually beats two separate single-column indexes.

## What I remove during reviews

- Indexes that mirror a primary key column order without adding selectivity.
- "Just in case" indexes on low-cardinality booleans.
- Duplicate indexes created by ORM migrations over time.

## Practical rule

Measure first with \`EXPLAIN (ANALYZE, BUFFERS)\`, then index the shape of the query—not the shape of the table diagram in your head.
`,

  "go-workers-and-queues": `# Go workers, queues, and the boring parts of scale

Background work is where backend systems stop being CRUD apps and start being systems. Go is a good fit here: small binaries, clear concurrency primitives, and a standard library that stays out of the way.

## A worker loop that fails safely

\`\`\`go
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
\`\`\`

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
`,
};

export function shouldUseWritingMock(): boolean {
  return process.env.ENTRIES_USE_MOCK === "true";
}

export function getMockPostBySlug(slug: string): EntriesPost | null {
  return mockWritingPosts.find((post) => post.slug === slug) ?? null;
}

export function getMockPostContent(slug: string): string | null {
  return mockWritingContent[slug] ?? null;
}
