"use client";
import "./agent-know-me.css";

import { useEffect, useState } from "react";

type AgentKnowMeProps = {
  brief: string;
  name: string;
};

function SparkleStar() {
  return (
    <svg
      className="agent-know-me__icon agent-know-me__icon--star"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.2l1.55 5.7L19.4 9.4l-5.85 1.5L12 16.8l-1.55-5.9L4.6 9.4l5.85-1.5L12 2.2z" />
    </svg>
  );
}

export function AgentKnowMe({ brief, name }: AgentKnowMeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } catch {
      setCopied(false);
    }
  }

  return (
    <span
      className={`hero-name${copied ? " is-copied" : ""}`}
      onClick={() => {
        void copyBrief();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void copyBrief();
        }
      }}
    >
      <span className="hero-name__text">{name}</span>
      <span className="agent-know-me agent-know-me--hero">
        <button
          type="button"
          className="agent-know-me__trigger"
          aria-label={copied ? "Copied agent brief" : "Copy agent brief"}
          aria-describedby="agent-know-me-alert"
          onClick={(event) => {
            event.stopPropagation();
            void copyBrief();
          }}
        >
          <span className="agent-know-me__sparkles" aria-hidden>
            <SparkleStar />
            <span className="agent-know-me__star agent-know-me__star--a" />
            <span className="agent-know-me__star agent-know-me__star--b" />
            <span className="agent-know-me__star agent-know-me__star--c" />
          </span>
        </button>

        <span className="agent-know-me__alert" id="agent-know-me-alert" role="status">
          {copied
            ? "Brief copied, paste it into your agent."
            : "In a hurry? Let your agent know me."}
          <span className="agent-know-me__alert-meta">
            {copied ? "Ready to paste" : "Click to copy brief"}
          </span>
        </span>
      </span>
    </span>
  );
}
