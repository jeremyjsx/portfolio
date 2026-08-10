"use client";

import { useState } from "react";
import "./pipeline-stepper.css";

type StageId = "rss" | "score" | "curate" | "sync";

type Stage = {
  id: StageId;
  label: string;
  where: "cloud" | "laptop";
  happy: string;
  failure: string;
};

const STAGES: Stage[] = [
  {
    id: "rss",
    label: "RSS",
    where: "cloud",
    happy: "Fetch feeds, normalize items, store new articles.",
    failure:
      "Duplicate URL or hash hit. No second row, no second Groq call.",
  },
  {
    id: "score",
    label: "Score",
    where: "cloud",
    happy: "LLM scoring lands in article_scores and article_tags.",
    failure: "Parse miss or bad model payload. Stage stays inspectable, not vibes.",
  },
  {
    id: "curate",
    label: "Curate",
    where: "cloud",
    happy: "Shortlist keepers. Retention drops stale rejects on a schedule.",
    failure:
      "Feed auto-disabled after repeated fetch failures. Reactivate is explicit.",
  },
  {
    id: "sync",
    label: "Local sync",
    where: "laptop",
    happy: "sync_obsidian writes markdown and marks export status in Postgres.",
    failure:
      "Cloud has no OBSIDIAN_VAULT_PATH. Run locally, or retry-failed for exports.",
  },
];

export function SignalPipelineStepper() {
  const [index, setIndex] = useState(0);
  const [showFailure, setShowFailure] = useState(false);
  const stage = STAGES[index];
  const atStart = index === 0;
  const atEnd = index === STAGES.length - 1;

  return (
    <figure className="signal-pipeline">
      <div className="signal-pipeline__header">
        <p className="signal-pipeline__eyebrow">Cloud judges, laptop writes</p>
        <div
          className="signal-pipeline__toggle"
          role="group"
          aria-label="Path mode"
        >
          <button
            type="button"
            className={
              !showFailure
                ? "signal-pipeline__toggle-btn is-active"
                : "signal-pipeline__toggle-btn"
            }
            aria-pressed={!showFailure}
            onClick={() => {
              if (showFailure) {
                setShowFailure(false);
                setIndex(0);
              }
            }}
          >
            Happy path
          </button>
          <button
            type="button"
            className={
              showFailure
                ? "signal-pipeline__toggle-btn is-active"
                : "signal-pipeline__toggle-btn"
            }
            aria-pressed={showFailure}
            onClick={() => {
              if (!showFailure) {
                setShowFailure(true);
                setIndex(0);
              }
            }}
          >
            Failure
          </button>
        </div>
      </div>

      <div className="signal-pipeline__stages" role="list">
        {STAGES.map((item, stageIndex) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className={[
              "signal-pipeline__stage",
              stageIndex === index ? "is-current" : "",
              stageIndex < index ? "is-done" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={stageIndex === index ? "step" : undefined}
            onClick={() => setIndex(stageIndex)}
          >
            <span className="signal-pipeline__stage-label">{item.label}</span>
            <span className="signal-pipeline__stage-where">{item.where}</span>
          </button>
        ))}
      </div>

      <div className="signal-pipeline__panel" aria-live="polite">
        <p className="signal-pipeline__meta">
          {stage.where === "cloud" ? "Cloud" : "Laptop"}
          <span aria-hidden> · </span>
          {showFailure ? "Failure mode" : "Happy path"}
        </p>
        <p className="signal-pipeline__title">{stage.label}</p>
        <p className="signal-pipeline__detail">
          {showFailure ? stage.failure : stage.happy}
        </p>
      </div>

      <div className="signal-pipeline__controls">
        <button
          type="button"
          className="signal-pipeline__control"
          disabled={atStart}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="signal-pipeline__control"
          disabled={atEnd}
          onClick={() =>
            setIndex((value) => Math.min(STAGES.length - 1, value + 1))
          }
        >
          Next
        </button>
      </div>

      <figcaption className="signal-pipeline__caption">
        Judgment stays in the cloud. The vault write stays on your machine.
      </figcaption>
    </figure>
  );
}
