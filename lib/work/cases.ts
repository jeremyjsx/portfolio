export const projectCaseStudies: Record<string, string> = {
  orderly: `## Overview

Orderly is an e-commerce backend built to handle catalog, checkout, and order lifecycle without turning every feature into a synchronous bottleneck.

## The problem

Early versions of e-commerce APIs often mix admin flows, customer flows, and fulfillment in one service layer. Retries duplicate charges, inventory drift shows up under load, and “real-time tracking” becomes polling endpoints.

## Approach

- **Domain boundaries** for catalog, cart, orders, and notifications.
- **Role-based auth** separating customer, staff, and system actors.
- **Async workers** for emails, inventory reconciliation, and status propagation.
- **Idempotent order creation** so client retries do not create duplicate orders.

\`\`\`python
# Simplified idempotency guard
def create_order(idempotency_key: str, payload: OrderCreate) -> Order:
    existing = repo.find_by_key(idempotency_key)
    if existing:
        return existing
    return repo.create(idempotency_key=idempotency_key, **payload)
\`\`\`

## Outcome

A backend shape that stays understandable as features grow: HTTP for commands, workers for side effects, and explicit order state instead of implicit side channels.

## Stack notes

Python for fast iteration on business rules, with clear module boundaries so hot paths can be optimized or extracted later.
`,

  entries: `## Overview

Entries is a content backend for Markdown posts—metadata in Postgres, body in S3, and publishing as an explicit state transition.

## The problem

Treating blog content like regular CRUD rows leads to large blobs in the database, painful media handling, and draft/published semantics bolted on after the fact.

## Approach

- **Posts API** with slug, title, status, and pagination.
- **Markdown in S3** fetched via \`GET /posts/{slug}/content\`.
- **Inline image handling** that uploads base64 assets and rewrites URLs.
- **Partial updates** so clients send only changed fields.

## Outcome

A small, predictable publishing surface that other apps can consume without re-implementing content storage.

## Why it matters here

Entries was built as a reusable content backend. This portfolio keeps writing as local markdown under \`content/writing/\`, but the same Posts API shape is what Entries exposes for apps that need remote publishing.
`,

  signal: `## Overview

Signal ingests RSS feeds, scores articles with an AI pipeline, and surfaces engineering content worth a backend engineer’s time.

## The problem

Raw RSS is noisy. Without scoring and deduplication, “curation” becomes another unread inbox.

## Approach

- **Ingest workers** normalize feed items and enqueue analysis jobs.
- **Scoring pipeline** ranks relevance, depth, and novelty.
- **Storage layer** keeps source metadata for traceability.
- **Review-friendly output** so humans can trust why something surfaced.

## Outcome

A pipeline-oriented design: fetch, enrich, score, publish—each step observable and replaceable without rewriting the whole system.

## Design principle

Optimize for replaceable stages. Models change; feed formats change; the queue contract should not.
`,

  workflows: `## Overview

Wallbit Workflows is open tooling for programmable financial flows—YAML specs, a CLI, Go SDK, and a public registry of workflow definitions.

## The problem

Financial integrations often become one-off scripts scattered across repos. They are hard to test, hard to share, and dangerous to rerun without guardrails.

## Approach

- **Declarative YAML** describing steps against Wallbit API operations.
- **CLI runner** for local and CI execution.
- **Go SDK** for embedding workflow execution in services.
- **Registry model** so workflows are versioned artifacts, not tribal knowledge.

\`\`\`yaml
version: 1
steps:
  - id: rates.get
  - id: balance.get_checking
\`\`\`

## Outcome

A developer-experience layer on top of API primitives—repeatable, reviewable, and closer to how backend teams already think about automation.
`,
};

export function getProjectCaseStudy(slug: string): string | undefined {
  return projectCaseStudies[slug];
}
