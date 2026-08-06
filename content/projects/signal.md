## Overview

Signal ingests RSS feeds, scores articles with an AI pipeline, and surfaces engineering content worth a backend engineer's time.

## The problem

Raw RSS is noisy. Without scoring and deduplication, "curation" becomes another unread inbox.

## Approach

- **Ingest workers** normalize feed items and enqueue analysis jobs.
- **Scoring pipeline** ranks relevance, depth, and novelty.
- **Storage layer** keeps source metadata for traceability.
- **Review-friendly output** so humans can trust why something surfaced.

## Outcome

A pipeline-oriented design: fetch, enrich, score, publish—each step observable and replaceable without rewriting the whole system.

## Design principle

Optimize for replaceable stages. Models change; feed formats change; the queue contract should not.
