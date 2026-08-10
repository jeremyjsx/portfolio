# Wallbit Workflows

Wallbit already exposes the building blocks - balances, rates, wallets, trades, cards, fees. What I kept rebuilding was the glue: a key, two or three calls in order, some print statements, and an error path that meant whatever felt right that night.

Wallbit Workflows turns that glue into YAML you can validate, run, version, and share - plus the CLI, registry, and Go SDK that make the loop usable.

## Start at the terminal

Day one is [wallbit-cli](https://github.com/wallbit-workflows/wallbit-cli):

```bash
go install github.com/jeremyjsx/wallbit-cli/cmd/wallbit@v0.2.0

wallbit auth login
wallbit balance checking
wallbit rates get --source USD --dest EUR
```

Auth stays ordinary (`--api-key`, `WALLBIT_API_KEY`, or `wallbit auth login`) so the interesting part can be the sequence of calls, not how the key gets smuggled into every script.

## Then the sequence becomes a file

A workflow is a small contract: `version: 1`, a `name`, optional `on_error`, and ordered `steps` whose `run` ids map to Wallbit operations the CLI already knows.

```yaml
version: 1
name: checking-then-fx
on_error: fail_fast
steps:
  - id: checking
    run: balance.get_checking
  - id: fx
    run: rates.get
    with:
      source: USD
      dest: EUR
```

```bash
wallbit workflow validate checking-then-fx.yaml
wallbit workflow run checking-then-fx.yaml
```

Same shape every time. Reviewable in a PR. Rerunnable without archaeology.

<!-- MEDIA_SLOT: workflows-1 -->

## Same API, better artifact

The before picture is hard-coded auth, a couple of HTTP calls, and exit codes that mean whatever you felt that night. The after picture is the file above plus two commands. Behavior is still the Wallbit API - the *artifact* changed. You can diff it, refuse a bad `run` id in review, and pull someone else’s flow without cloning their `scripts/` folder.

<!-- MEDIA_SLOT: workflows-2 -->

## Distribution: the registry

A useful flow stuck on one machine is still local. [wallbit-registry](https://github.com/wallbit-workflows/wallbit-registry) is the public catalog: list, download YAML, publish **immutable semver** for `author/slug`. Duplicate version returns conflict. Pull is public; publish uses a separate registry key (`wb_reg_…` / `wallbit registry login`), not your Wallbit API key.

```bash
wallbit workflow pull author/slug@1.0.0 -o my-flow.yaml
wallbit workflow publish ./my-flow.yaml --version 1.0.0 --slug my-flow
```

Go HTTP API on Postgres, Next.js for catalog, install commands, account keys, and Workflow Studio. Studio authors YAML against the same rules the CLI validates - editor and runner stay aligned.

<!-- MEDIA_SLOT: workflows-3 -->

## Authoring that matches validation

[wallbit-workflow-builder](https://github.com/jeremyjsx/skills) (skill + rules used by Studio) keeps generated YAML in the same dialect as `wallbit workflow validate`: same `version: 1`, same run catalog, same `on_error` / `with` / step-ref habits. Pretty editor and what actually runs share one contract.

## When you want Go instead of YAML

YAML is for shared, rerunnable composition. Services still want a library. [wallbit-go](https://github.com/wallbit-workflows/wallbit-go) is the idiomatic SDK the CLI sits on: typed clients, context, structured errors, retries on safe methods.

```go
client, err := wallbit.NewClient(os.Getenv("WALLBIT_API_KEY"))
balance, err := client.Balance.GetChecking(ctx)
```

Embed path for apps; YAML path for automations you want to pull and publish. Same API, different packaging.

## Four repos, one trip

| Piece | Job |
| --- | --- |
| [wallbit-cli](https://github.com/wallbit-workflows/wallbit-cli) | Auth, account ops, `workflow validate\|run\|pull\|publish` |
| [wallbit-registry](https://github.com/wallbit-workflows/wallbit-registry) | Discover / version / pull / publish immutable YAML |
| [wallbit-go](https://github.com/wallbit-workflows/wallbit-go) | Go SDK; CLI built on it |
| [wallbit-workflow-builder](https://github.com/jeremyjsx/skills) | Skill/rules (+ Studio) so authored YAML matches CLI validation |

Not a new finance API - a composition layer you can treat like software: a file, a command, a version, a pull.
