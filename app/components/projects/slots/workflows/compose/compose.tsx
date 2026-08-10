"use client";

import { useMemo, useState } from "react";
import "./compose.css";

const ALLOWED_RUNS = [
  "balance.get_checking",
  "rates.get",
  "fees.get",
  "trades.create",
  "wallets.list",
  "transactions.list",
] as const;

type PresetId = "balance" | "fx" | "broken";

const PRESETS: Record<
  PresetId,
  { label: string; yaml: string }
> = {
  balance: {
    label: "Balance only",
    yaml: `version: 1
name: checking-balance
on_error: fail_fast
steps:
  - id: checking
    run: balance.get_checking
`,
  },
  fx: {
    label: "Checking → FX",
    yaml: `version: 1
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
`,
  },
  broken: {
    label: "Broken run id",
    yaml: `version: 1
name: broken-flow
on_error: fail_fast
steps:
  - id: checking
    run: balance.get_checking
  - id: oops
    run: magic.do_thing
`,
  },
};

type ParsedStep = {
  id: string;
  run: string;
};

type ValidationResult =
  | { ok: true; name: string; steps: ParsedStep[] }
  | { ok: false; errors: string[]; steps: ParsedStep[] };

function parseWorkflowYaml(source: string): ValidationResult {
  const errors: string[] = [];
  const text = source.replace(/\r\n/g, "\n").trim();

  if (!text) {
    return { ok: false, errors: ["Workflow is empty."], steps: [] };
  }

  const versionMatch = text.match(/^version:\s*(.+)$/m);
  if (!versionMatch) {
    errors.push("Missing version.");
  } else if (versionMatch[1].trim() !== "1") {
    errors.push(`Unsupported version: ${versionMatch[1].trim()} (expected 1).`);
  }

  const nameMatch = text.match(/^name:\s*(.+)$/m);
  const name = nameMatch?.[1]?.trim() ?? "";
  if (!name) {
    errors.push("Missing name.");
  }

  if (!/^steps:\s*$/m.test(text) && !/^steps:\s*\n/m.test(text)) {
    errors.push("Missing steps.");
  }

  const steps: ParsedStep[] = [];
  const stepBlocks = text.split(/\n(?=\s*-\s+id:\s*)/).slice(1);

  for (const block of stepBlocks) {
    const idMatch = block.match(/^\s*-\s+id:\s*(\S+)\s*$/m) ?? block.match(/id:\s*(\S+)/);
    const runMatch = block.match(/run:\s*(\S+)/);
    const id = idMatch?.[1] ?? "";
    const run = runMatch?.[1] ?? "";

    if (!id) {
      errors.push("A step is missing id.");
      continue;
    }
    if (!run) {
      errors.push(`Step "${id}" is missing run.`);
      continue;
    }
    if (!(ALLOWED_RUNS as readonly string[]).includes(run)) {
      errors.push(`Unknown run id "${run}" on step "${id}".`);
    }
    steps.push({ id, run });
  }

  if (steps.length === 0 && errors.every((error) => !error.includes("steps"))) {
    errors.push("Add at least one step with id and run.");
  }

  const uniqueIds = new Set(steps.map((step) => step.id));
  if (uniqueIds.size !== steps.length) {
    errors.push("Step ids must be unique.");
  }

  if (errors.length > 0) {
    return { ok: false, errors, steps };
  }

  return { ok: true, name, steps };
}

export function WorkflowsCompose() {
  const [yaml, setYaml] = useState(PRESETS.fx.yaml);
  const result = useMemo(() => parseWorkflowYaml(yaml), [yaml]);

  return (
    <figure className="workflows-compose">
      <div className="workflows-compose__header">
        <div>
          <p className="workflows-compose__eyebrow">Compose a tiny flow</p>
          <p className="workflows-compose__subtitle">
            Switch presets to validate. Same shape as wallbit workflow validate.
          </p>
        </div>
        <div className="workflows-compose__presets" role="group" aria-label="Presets">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={
                yaml === PRESETS[id].yaml
                  ? "workflows-compose__preset is-active"
                  : "workflows-compose__preset"
              }
              onClick={() => setYaml(PRESETS[id].yaml)}
            >
              {PRESETS[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className="workflows-compose__grid">
        <div className="workflows-compose__editor">
          <span className="workflows-compose__label">YAML</span>
          <pre className="workflows-compose__code" tabIndex={0} aria-label="Workflow YAML">
            <code>{yaml.trimEnd()}</code>
          </pre>
        </div>

        <div className="workflows-compose__side">
          <p className="workflows-compose__label">Steps</p>
          {result.steps.length > 0 ? (
            <ol className="workflows-compose__steps">
              {result.steps.map((step, index) => (
                <li key={`${step.id}-${index}`}>
                  <span className="workflows-compose__step-id">{step.id}</span>
                  <span className="workflows-compose__step-run">{step.run}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="workflows-compose__empty">No parseable steps yet.</p>
          )}

          <div
            className={
              result.ok
                ? "workflows-compose__result is-ok"
                : "workflows-compose__result is-bad"
            }
            aria-live="polite"
          >
            {result.ok ? (
              <p className="workflows-compose__result-title">
                Valid · {result.name}
              </p>
            ) : (
              <>
                <p className="workflows-compose__result-title">Invalid</p>
                <ul className="workflows-compose__errors">
                  {result.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <figcaption className="workflows-compose__caption">
        Try the broken preset. Unknown run ids fail the same way the CLI would refuse them.
      </figcaption>
    </figure>
  );
}
