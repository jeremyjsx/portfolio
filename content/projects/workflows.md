## Overview

Wallbit Workflows is open tooling for programmable financial flows—YAML specs, a CLI, Go SDK, and a public registry of workflow definitions.

## The problem

Financial integrations often become one-off scripts scattered across repos. They are hard to test, hard to share, and dangerous to rerun without guardrails.

## Approach

- **Declarative YAML** describing steps against Wallbit API operations.
- **CLI runner** for local and CI execution.
- **Go SDK** for embedding workflow execution in services.
- **Registry model** so workflows are versioned artifacts, not tribal knowledge.

```yaml
version: 1
steps:
  - id: rates.get
  - id: balance.get_checking
```

## Outcome

A developer-experience layer on top of API primitives—repeatable, reviewable, and closer to how backend teams already think about automation.
