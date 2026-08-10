"use client";

import { useState } from "react";
import "./registry.css";

type RegistryWorkflow = {
  slug: string;
  author: string;
  version: string;
  description: string;
  yaml: string;
};

const WORKFLOWS: RegistryWorkflow[] = [
  {
    author: "jeremy",
    slug: "checking-then-fx",
    version: "1.0.0",
    description: "Read checking balance, then pull a USD to EUR rate.",
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
  {
    author: "jeremy",
    slug: "fees-snapshot",
    version: "1.1.0",
    description: "Grab current fee schedule for ops review.",
    yaml: `version: 1
name: fees-snapshot
steps:
  - id: fees
    run: fees.get
`,
  },
  {
    author: "ops",
    slug: "wallets-overview",
    version: "0.3.0",
    description: "List wallets before running a funding flow.",
    yaml: `version: 1
name: wallets-overview
steps:
  - id: wallets
    run: wallets.list
`,
  },
];

export function WorkflowsRegistry() {
  const [selectedSlug, setSelectedSlug] = useState(WORKFLOWS[0].slug);
  const [copied, setCopied] = useState(false);
  const selected =
    WORKFLOWS.find((workflow) => workflow.slug === selectedSlug) ?? WORKFLOWS[0];
  const pullCommand = `wallbit workflow pull ${selected.author}/${selected.slug}@${selected.version} -o ${selected.slug}.yaml`;

  async function copyPull() {
    try {
      await navigator.clipboard.writeText(pullCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="workflows-registry">
      <div className="workflows-registry__header">
        <p className="workflows-registry__eyebrow">Browse → copy pull</p>
        <p className="workflows-registry__subtitle">
          Fixture catalog. No live registry calls.
        </p>
      </div>

      <div className="workflows-registry__layout">
        <ul className="workflows-registry__list">
          {WORKFLOWS.map((workflow) => {
            const active = workflow.slug === selected.slug;
            return (
              <li key={workflow.slug}>
                <button
                  type="button"
                  className={
                    active
                      ? "workflows-registry__card is-active"
                      : "workflows-registry__card"
                  }
                  onClick={() => {
                    setSelectedSlug(workflow.slug);
                    setCopied(false);
                  }}
                >
                  <span className="workflows-registry__card-title">
                    {workflow.author}/{workflow.slug}
                  </span>
                  <span className="workflows-registry__card-meta">
                    v{workflow.version}
                  </span>
                  <span className="workflows-registry__card-desc">
                    {workflow.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="workflows-registry__detail">
          <p className="workflows-registry__label">YAML preview</p>
          <pre className="workflows-registry__yaml">
            <code>{selected.yaml.trim()}</code>
          </pre>

          <p className="workflows-registry__label">Install</p>
          <div className="workflows-registry__pull">
            <code>{pullCommand}</code>
            <button
              type="button"
              className="workflows-registry__copy"
              onClick={copyPull}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <figcaption className="workflows-registry__caption">
        Pull is public. Publish still needs a registry key in the real CLI.
      </figcaption>
    </figure>
  );
}
