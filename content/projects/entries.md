# Entries

Entries is a Go content backend for Markdown posts. Metadata and publish state live in PostgreSQL. The body lives in S3. Inline images get lifted out of the markdown into object storage with URL rewrites. stdlib `net/http`, sqlc, Goose, LocalStack in local dev - boring infrastructure so the content model stays the interesting part.

## A publishing API, not a dump of files

Create, list, fetch by slug, pull content separately, partial-update fields, publish, delete:

```text
GET    /posts
POST   /posts
GET    /posts/{slug}
GET    /posts/{slug}/content
PUT    /posts/{slug}              # partial - send only what changed
PATCH  /posts/{slug}/publish
DELETE /posts/{slug}
```

Status is `draft` or `published`. Publish is its own `PATCH`, not a boolean flipped in the same write that rewrites the body. Content is `GET /posts/{slug}/content`, not stuffed into every list row. Edit title, write markdown, publish - three jobs, three calls.

<!-- MEDIA_SLOT: entries-1 -->

## Metadata you can query; bodies that can grow

Postgres holds the row: slug, title, status, timestamps - anything you need to list and filter. S3 holds `posts/{slug}.md`. Locally that bucket is LocalStack with path-style URLs so the full loop runs without an AWS account.

Stuffing long articles into `TEXT` columns and leaving base64 images in the document works until it does not. Split storage keeps list paths light and treats the article body like an object - closer to how publishing systems behave once posts get long or image-heavy.

## Images leave the document

Paste a draft with a data-URI image. On write, Entries uploads the bytes to S3 and rewrites the markdown to a public URL. Objects land under `posts/{slug}/images/{uuid}.{ext}`. The `.md` keeps a link.

Same service interface against LocalStack or real S3 - endpoint config changes, the code path does not. That rewrite is the part worth demoing first; CRUD and publish exist so the move stays honest under a real API.

<!-- MEDIA_SLOT: entries-2 -->

## Clear packages, deliberate publish

Handlers, post domain (repository / service / model), storage interface, middleware (logging, request ID, recovery), Goose migrations, sqlc-generated queries, unit and integration tests. Publish can emit `post.published` for downstream work when you wire consumers - the core you ship today is store, rewrite, and publish by slug.

<!-- MEDIA_SLOT: entries-3 -->

Go, stdlib HTTP, PostgreSQL, sqlc, Goose, S3. Small surface. Predictable publishing for other apps to call.
