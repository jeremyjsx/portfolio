"use client";
import "./checkout-path.css";

import { useState } from "react";

type Mode = "sync" | "orderly";

type Step = {
  id: string;
  label: string;
  failHint?: boolean;
};

const SYNC_STEPS: Step[] = [
  { id: "auth", label: "Auth" },
  { id: "stock", label: "Lock stock" },
  { id: "charge", label: "Charge card", failHint: true },
  { id: "status", label: "Status → processing" },
];

const ORDERLY_HTTP_STEPS: Step[] = [
  { id: "auth", label: "Auth" },
  { id: "stock", label: "Lock stock" },
  { id: "persist", label: "Persist order pending" },
  { id: "publish", label: "Publish order.created" },
];

const ORDERLY_WORKER_STEPS: Step[] = [
  { id: "charge", label: "Payment worker charges", failHint: true },
  { id: "status", label: "Status → processing" },
  { id: "event", label: "payment.processed" },
];

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="orderly-checkout-path__steps">
      {steps.map((step) => (
        <li key={step.id} className="orderly-checkout-path__step">
          <span className="orderly-checkout-path__step-label">{step.label}</span>
          {step.failHint ? (
            <span className="orderly-checkout-path__fail-hint">
              what fails here?
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function OrderlyCheckoutPath() {
  const [mode, setMode] = useState<Mode>("orderly");

  return (
    <figure className="orderly-checkout-path">
      <div className="orderly-checkout-path__header">
        <p className="orderly-checkout-path__eyebrow">Checkout path</p>
        <div
          className="orderly-checkout-path__toggle"
          role="group"
          aria-label="Checkout path mode"
        >
          <button
            type="button"
            className={
              mode === "sync"
                ? "orderly-checkout-path__toggle-btn is-active"
                : "orderly-checkout-path__toggle-btn"
            }
            aria-pressed={mode === "sync"}
            onClick={() => setMode("sync")}
          >
            Sync (fat request)
          </button>
          <button
            type="button"
            className={
              mode === "orderly"
                ? "orderly-checkout-path__toggle-btn is-active"
                : "orderly-checkout-path__toggle-btn"
            }
            aria-pressed={mode === "orderly"}
            onClick={() => setMode("orderly")}
          >
            Orderly (queue)
          </button>
        </div>
      </div>

      {mode === "sync" ? (
        <div className="orderly-checkout-path__lanes orderly-checkout-path__lanes--single">
          <div className="orderly-checkout-path__lane orderly-checkout-path__lane--http">
            <p className="orderly-checkout-path__lane-title">HTTP request</p>
            <p className="orderly-checkout-path__lane-note">
              Everything shares one timeout
            </p>
            <StepList steps={SYNC_STEPS} />
            <div className="orderly-checkout-path__cutoff" aria-hidden>
              <span>response returns (if anything is left)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="orderly-checkout-path__lanes">
          <div className="orderly-checkout-path__lane orderly-checkout-path__lane--http">
            <p className="orderly-checkout-path__lane-title">HTTP request</p>
            <StepList steps={ORDERLY_HTTP_STEPS} />
            <div className="orderly-checkout-path__cutoff">
              <span>response returns</span>
            </div>
          </div>
          <div className="orderly-checkout-path__lane orderly-checkout-path__lane--worker">
            <p className="orderly-checkout-path__lane-title">After response</p>
            <StepList steps={ORDERLY_WORKER_STEPS} />
          </div>
        </div>
      )}

      <figcaption className="orderly-checkout-path__caption">
        Flip the toggle to move charge off the request timeout.
      </figcaption>
    </figure>
  );
}
