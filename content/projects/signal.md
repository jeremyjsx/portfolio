# Signal

Most feed readers optimize for volume. I wanted something quieter: pull RSS, score what is worth reading for backend work, watch feed health, and land the keepers in Obsidian where I already take notes.

That is Signal - a backend-first pipeline with a thin web surface over the API. Cloud handles ingest and judgment. A local worker writes markdown into the vault.

## A normal day with it

Kick a fetch when you want fresh items:

`POST /api/feeds/fetch`

Items normalize into a common shape. URL normalization and hash memory keep mirrors and retries from inventing a second article - or spending another model call on something already scored. Structured scores and tags land in `article_scores` / `article_tags`, so “why did this make the cut?” is a row, not a vibe.

Check feed quality:

`GET /api/feeds/quality`

Feeds move between `healthy`, `degraded`, and `disabled`. Repeated failures can auto-disable a source so a dead blog does not dominate the job log. Reactivation is explicit: `POST /api/feeds/{feed_id}/reactivate`.

Curate a shortlist. Cleanup drops stale non-curated rows on a schedule (`POST /api/feeds/cleanup`) so rejects do not become permanent storage. Job history at `GET /api/jobs/runs` when you want to see what actually ran.

Then sync keepers into the vault:

```bash
uv run python -m app.scripts.sync_obsidian
```

Failed writes retry through the API without re-fetching the internet:

`POST /api/articles/obsidian/retry-failed?limit=50`

<!-- MEDIA_SLOT: signal-1 -->

## Why the cloud stops at the vault

I already think in Obsidian - highlights, links, half-formed notes about Postgres or queues. Keepers that die in a web UI never get woven into that. Markdown in the vault does.

A cloud runtime cannot write `OBSIDIAN_VAULT_PATH`. That is the design, not a missing feature. The cloud owns ingest, scoring, health, retention, and export status. The local `sync_obsidian` script owns the filesystem write and marks status back in Postgres.

Curation state is the source of truth. The vault is a derived view of what you chose to keep. Scoring providers and markdown formatting can move; the queue and status contracts stay stable.

<!-- MEDIA_SLOT: signal-2 -->

## Judgment you can inspect

Scoring is LLM-assisted via Groq. The model is swappable; the persisted shape is what the rest of the system depends on. List articles with filters, read tags, curate deliberately. Feeds are operational entities - they degrade, disable, and reactivate - which matters more day to day than any single prompt.

<!-- MEDIA_SLOT: signal-3 -->

## Stack, briefly

FastAPI on PostgreSQL (async SQLAlchemy + asyncpg, Alembic). APScheduler for fetch and cleanup. Groq for scoring. uv and pytest for the toolchain. Deploy is Railway-oriented; Obsidian sync stays local on purpose. Tests cover URL/hash behavior, feed health, scheduler runs, Obsidian writer/sync, and score parsing.

Fetch. Score. Curate. Sync. Less unread noise, more notes that stick.
