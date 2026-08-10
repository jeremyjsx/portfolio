"use client";

import { useState } from "react";
import "./make-the-cut.css";

type Verdict = "keep" | "skip";

type ArticleCard = {
  id: string;
  title: string;
  source: string;
  blurb: string;
  verdict: Verdict;
  score: number;
  tags: string[];
  rationale: string;
};

const ARTICLES: ArticleCard[] = [
  {
    id: "roundup",
    title: "10 links you might have missed this week",
    source: "eng-digest.example",
    blurb: "A shallow roundup of headlines with almost no technical depth.",
    verdict: "skip",
    score: 0.22,
    tags: ["links", "noise"],
    rationale: "Low learning value for backend work. Link roundups rarely survive.",
  },
  {
    id: "postgres",
    title: "How Postgres MVCC actually chooses row versions",
    source: "internals.example",
    blurb: "A deep walkthrough of visibility maps, xmax, and vacuum tradeoffs.",
    verdict: "keep",
    score: 0.91,
    tags: ["postgres", "storage", "internals"],
    rationale: "High signal for backend engineers. Concrete internals, not vibes.",
  },
  {
    id: "changelog",
    title: "Acme Cloud: March product update",
    source: "changelog.acme.example",
    blurb: "New UI themes, billing page tweaks, and a webinar invite.",
    verdict: "skip",
    score: 0.18,
    tags: ["changelog", "vendor"],
    rationale: "Vendor noise. Useful for customers, not for learning systems.",
  },
  {
    id: "systems",
    title: "Designing idempotent payment APIs under retries",
    source: "systems.example",
    blurb: "Keys, replay windows, and what breaks when the client lies about failure.",
    verdict: "keep",
    score: 0.88,
    tags: ["apis", "reliability", "payments"],
    rationale: "Practical systems writing. Maps directly to API design work.",
  },
];

type GuessState = {
  guess: Verdict | null;
  revealed: boolean;
};

export function SignalMakeTheCut() {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<string, GuessState>>(() =>
    Object.fromEntries(
      ARTICLES.map((article) => [
        article.id,
        { guess: null, revealed: false },
      ]),
    ),
  );

  const article = ARTICLES[index];
  const current = states[article.id];
  const atStart = index === 0;
  const atEnd = index === ARTICLES.length - 1;
  const revealedCount = ARTICLES.filter((item) => states[item.id].revealed).length;

  function guess(verdict: Verdict) {
    if (current.revealed) return;
    setStates((prev) => ({
      ...prev,
      [article.id]: { guess: verdict, revealed: true },
    }));
  }

  function resetAll() {
    setIndex(0);
    setStates(
      Object.fromEntries(
        ARTICLES.map((item) => [item.id, { guess: null, revealed: false }]),
      ),
    );
  }

  const matched =
    current.revealed && current.guess === article.verdict;

  return (
    <figure className="signal-cut">
      <div className="signal-cut__header">
        <div>
          <p className="signal-cut__eyebrow">Would this make the cut?</p>
          <p className="signal-cut__subtitle">
            Guess keep or skip. Outcomes are fixed mocks, not live Groq.
          </p>
        </div>
        <p className="signal-cut__progress">
          {index + 1} / {ARTICLES.length}
          {revealedCount > 0 ? (
            <span className="signal-cut__progress-meta">
              {" "}
              · {revealedCount} revealed
            </span>
          ) : null}
        </p>
      </div>

      <div className="signal-cut__card" aria-live="polite">
        <p className="signal-cut__source">{article.source}</p>
        <h3 className="signal-cut__title">{article.title}</h3>
        <p className="signal-cut__blurb">{article.blurb}</p>

        {!current.revealed ? (
          <div className="signal-cut__actions">
            <button
              type="button"
              className="signal-cut__action signal-cut__action--keep"
              onClick={() => guess("keep")}
            >
              Keep
            </button>
            <button
              type="button"
              className="signal-cut__action signal-cut__action--skip"
              onClick={() => guess("skip")}
            >
              Skip
            </button>
          </div>
        ) : (
          <div
            className={
              matched
                ? "signal-cut__reveal is-match"
                : "signal-cut__reveal is-miss"
            }
          >
            <p className="signal-cut__reveal-line">
              You guessed <strong>{current.guess}</strong>
              <span aria-hidden> · </span>
              Signal would <strong>{article.verdict}</strong>
              <span aria-hidden> · </span>
              score {article.score.toFixed(2)}
            </p>
            <ul className="signal-cut__tags">
              {article.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <p className="signal-cut__rationale">{article.rationale}</p>
          </div>
        )}
      </div>

      <div className="signal-cut__controls">
        <button
          type="button"
          className="signal-cut__control"
          disabled={atStart}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="signal-cut__control"
          disabled={atEnd}
          onClick={() =>
            setIndex((value) => Math.min(ARTICLES.length - 1, value + 1))
          }
        >
          Next
        </button>
        {revealedCount > 0 ? (
          <button
            type="button"
            className="signal-cut__control signal-cut__control--ghost"
            onClick={resetAll}
          >
            Reset
          </button>
        ) : null}
      </div>

      <figcaption className="signal-cut__caption">
        Illustrative only. The persisted score shape matters more than any one model call.
      </figcaption>
    </figure>
  );
}
