"use client";
import "./retry-dlq.css";

import { useState } from "react";

type TimelineStep = {
  id: string;
  label: string;
  detail: string;
  kind: "event" | "fail" | "retry" | "dlq";
  meta?: string;
};

const STEPS: TimelineStep[] = [
  {
    id: "created",
    label: "order.created",
    detail: "Checkout published the event. Payment work starts on the worker.",
    kind: "event",
  },
  {
    id: "fail",
    label: "Transient failure",
    detail: "Provider flakes or times out. Not a poison payload - worth retrying.",
    kind: "fail",
  },
  {
    id: "retry-1",
    label: "Retry 1 / 3",
    detail: "Requeue with x-retry-count = 1 after 1s backoff.",
    kind: "retry",
    meta: "1s",
  },
  {
    id: "retry-2",
    label: "Retry 2 / 3",
    detail: "Still failing. Backoff doubles to 2s.",
    kind: "retry",
    meta: "2s",
  },
  {
    id: "retry-3",
    label: "Retry 3 / 3",
    detail: "Last attempt at 4s. MAX_RETRY_ATTEMPTS is exhausted after this.",
    kind: "retry",
    meta: "4s",
  },
  {
    id: "dlq",
    label: "order_created_dlq",
    detail:
      "Reject without requeue. RabbitMQ parks the message on the dead-letter queue for inspection.",
    kind: "dlq",
  },
];

export function OrderlyRetryDlq() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const atStart = index === 0;
  const atEnd = index === STEPS.length - 1;

  return (
    <figure className="orderly-retry-dlq">
      <div className="orderly-retry-dlq__header">
        <p className="orderly-retry-dlq__eyebrow">Retry → DLQ</p>
        <p className="orderly-retry-dlq__subtitle">
          Step through a payment message leaving the happy path
        </p>
      </div>

      <div className="orderly-retry-dlq__track" role="list">
        {STEPS.map((item, stepIndex) => {
          const stateClass =
            stepIndex === index
              ? "is-current"
              : stepIndex < index
                ? "is-done"
                : "";

          return (
            <button
              key={item.id}
              type="button"
              role="listitem"
              className={`orderly-retry-dlq__node orderly-retry-dlq__node--${item.kind} ${stateClass}`.trim()}
              aria-current={stepIndex === index ? "step" : undefined}
              aria-label={`${item.label}${item.meta ? ` (${item.meta})` : ""}`}
              onClick={() => setIndex(stepIndex)}
            >
              <span className="orderly-retry-dlq__node-label">{item.label}</span>
              {item.meta ? (
                <span className="orderly-retry-dlq__node-meta">{item.meta}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="orderly-retry-dlq__panel" aria-live="polite">
        <p className="orderly-retry-dlq__step-count">
          Step {index + 1} / {STEPS.length}
        </p>
        <p className="orderly-retry-dlq__step-title">{step.label}</p>
        <p className="orderly-retry-dlq__step-detail">{step.detail}</p>
      </div>

      <div className="orderly-retry-dlq__controls">
        <button
          type="button"
          className="orderly-retry-dlq__control"
          disabled={atStart}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="orderly-retry-dlq__control"
          disabled={atEnd}
          onClick={() =>
            setIndex((value) => Math.min(STEPS.length - 1, value + 1))
          }
        >
          Next
        </button>
      </div>

      <figcaption className="orderly-retry-dlq__caption">
        Same policy as the worker: three retries, then the DLQ.
      </figcaption>
    </figure>
  );
}
