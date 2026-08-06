## Overview

Entries is a content backend for Markdown posts—metadata in Postgres, body in S3, and publishing as an explicit state transition.

## The problem

Treating blog content like regular CRUD rows leads to large blobs in the database, painful media handling, and draft/published semantics bolted on after the fact.

## Approach

- **Posts API** with slug, title, status, and pagination.
- **Markdown in S3** fetched via `GET /posts/{slug}/content`.
- **Inline image handling** that uploads base64 assets and rewrites URLs.
- **Partial updates** so clients send only changed fields.

## Outcome

A small, predictable publishing surface that other apps can consume without re-implementing content storage.

## Why it matters here

Entries was built as a reusable content backend. This portfolio keeps writing as local markdown under `content/writing/`, but the same Posts API shape is what Entries exposes for apps that need remote publishing.
