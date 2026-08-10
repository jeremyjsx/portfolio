"use client";
import "./state-machine.css";

import { useEffect, useState } from "react";

type OrderState =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const TRANSITIONS: Record<OrderState, OrderState[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const ANNOTATIONS: Partial<Record<`${OrderState}>${OrderState}`, string>> = {
  "pending>processing": "payment worker",
  "processing>shipped": "driver assign",
  "pending>cancelled": "cancel restores stock",
  "processing>cancelled": "cancel restores stock",
};

const MAIN_FLOW: OrderState[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

function isLegal(from: OrderState, to: OrderState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function OrderlyStateMachine() {
  const [selected, setSelected] = useState<OrderState>("pending");
  const [blocked, setBlocked] = useState<OrderState | null>(null);
  const next = TRANSITIONS[selected];

  useEffect(() => {
    if (!blocked) return;
    const timer = window.setTimeout(() => setBlocked(null), 450);
    return () => window.clearTimeout(timer);
  }, [blocked]);

  function onStateClick(state: OrderState) {
    if (state === selected) {
      return;
    }

    // Terminal states have no exits - allow refocus so you can keep exploring.
    if (next.length === 0) {
      setSelected(state);
      setBlocked(null);
      return;
    }

    if (isLegal(selected, state)) {
      setSelected(state);
      setBlocked(null);
      return;
    }

    setBlocked(state);
  }

  const annotationChips = [
    ...new Set(
      next
        .map((to) => ANNOTATIONS[`${selected}>${to}`])
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  return (
    <figure className="orderly-state-machine">
      <div className="orderly-state-machine__header">
        <p className="orderly-state-machine__eyebrow">Order status</p>
        <p className="orderly-state-machine__subtitle">
          Click a legal next state to move. Illegal jumps bounce.
        </p>
      </div>

      <div
        className="orderly-state-machine__graph"
        aria-label="Order state machine"
      >
        <div className="orderly-state-machine__main-flow">
          {MAIN_FLOW.map((state, index) => (
            <div key={state} className="orderly-state-machine__main-item">
              <StateNode
                state={state}
                selected={selected === state}
                legal={next.includes(state)}
                blocked={blocked === state}
                onClick={() => onStateClick(state)}
              />
              {index < MAIN_FLOW.length - 1 ? (
                <span
                  className={
                    selected === MAIN_FLOW[index] &&
                    isLegal(MAIN_FLOW[index], MAIN_FLOW[index + 1])
                      ? "orderly-state-machine__edge is-active"
                      : "orderly-state-machine__edge"
                  }
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="orderly-state-machine__branch">
          <span
            className={
              next.includes("cancelled")
                ? "orderly-state-machine__branch-rail is-active"
                : "orderly-state-machine__branch-rail"
            }
            aria-hidden
          />
          <StateNode
            state="cancelled"
            selected={selected === "cancelled"}
            legal={next.includes("cancelled")}
            blocked={blocked === "cancelled"}
            onClick={() => onStateClick("cancelled")}
          />
        </div>
      </div>

      <div className="orderly-state-machine__detail" aria-live="polite">
        <p className="orderly-state-machine__detail-line">
          {next.length > 0 ? (
            <>
              From <code>{selected}</code>
              <span aria-hidden> → </span>
              {next.map((state, index) => (
                <span key={state}>
                  {index > 0 ? <span aria-hidden> | </span> : null}
                  <code>{state}</code>
                </span>
              ))}
            </>
          ) : (
            <>
              From <code>{selected}</code>
              <span aria-hidden> → </span>
              <span className="orderly-state-machine__nowhere">nowhere</span>
              <span className="orderly-state-machine__hint">
                {" "}
                · click any state to refocus
              </span>
            </>
          )}
        </p>

        {annotationChips.length > 0 ? (
          <ul className="orderly-state-machine__chips">
            {annotationChips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <figcaption className="orderly-state-machine__caption">
        Poke a state. Illegal jumps bounce.
      </figcaption>
    </figure>
  );
}

function StateNode({
  state,
  selected,
  legal,
  blocked,
  onClick,
}: {
  state: OrderState;
  selected: boolean;
  legal: boolean;
  blocked: boolean;
  onClick: () => void;
}) {
  const className = [
    "orderly-state-machine__node",
    selected ? "is-selected" : "",
    legal ? "is-legal" : "",
    blocked ? "is-blocked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      aria-pressed={selected}
      aria-label={`Order state ${state}`}
      onClick={onClick}
    >
      {state}
      {blocked ? (
        <span className="orderly-state-machine__blocked-tag">blocked</span>
      ) : null}
    </button>
  );
}
