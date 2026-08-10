"use client";

import { useState } from "react";
import "./publish-flow.css";

type Frame = {
  id: string;
  verb: string;
  path: string;
  title: string;
  body: string;
  detail: string;
};

const FRAMES: Frame[] = [
  {
    id: "draft",
    verb: "POST",
    path: "/posts",
    title: "Create draft",
    body: "slug: hello-world\nstatus: draft\npublished_at: null",
    detail: "Postgres row only. No body object yet.",
  },
  {
    id: "content",
    verb: "PUT",
    path: "/posts/hello-world",
    title: "Write markdown + image",
    body: "posts/hello-world.md\nposts/hello-world/images/a1b2c3d4.png",
    detail: "S3 gets the body and extracted bytes. Markdown keeps a URL.",
  },
  {
    id: "publish",
    verb: "PATCH",
    path: "/posts/hello-world/publish",
    title: "Publish",
    body: "status: published\npublished_at: 2026-03-12T18:04:11Z",
    detail: "Publish is its own call. Status flips without rewriting the body.",
  },
];

export function EntriesPublishFlow() {
  const [index, setIndex] = useState(0);
  const frame = FRAMES[index];
  const atStart = index === 0;
  const atEnd = index === FRAMES.length - 1;

  return (
    <figure className="entries-publish">
      <div className="entries-publish__header">
        <div>
          <p className="entries-publish__eyebrow">Draft → published object</p>
          <p className="entries-publish__subtitle">
            Three calls, three jobs. Step through the operator beat.
          </p>
        </div>
        <p className="entries-publish__progress">
          {index + 1} / {FRAMES.length}
        </p>
      </div>

      <ol className="entries-publish__rail" aria-label="Publish steps">
        {FRAMES.map((item, itemIndex) => (
          <li key={item.id}>
            <button
              type="button"
              className={
                itemIndex === index
                  ? "entries-publish__rail-btn is-active"
                  : itemIndex < index
                    ? "entries-publish__rail-btn is-done"
                    : "entries-publish__rail-btn"
              }
              aria-current={itemIndex === index ? "step" : undefined}
              onClick={() => setIndex(itemIndex)}
            >
              <span className="entries-publish__rail-verb">{item.verb}</span>
              <span className="entries-publish__rail-title">{item.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="entries-publish__frame" aria-live="polite">
        <p className="entries-publish__request">
          <span className="entries-publish__verb">{frame.verb}</span>{" "}
          <code>{frame.path}</code>
        </p>
        <pre className="entries-publish__body">
          <code>{frame.body}</code>
        </pre>
        <p className="entries-publish__detail">{frame.detail}</p>
      </div>

      <div className="entries-publish__controls">
        <button
          type="button"
          className="entries-publish__control"
          disabled={atStart}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="entries-publish__control"
          disabled={atEnd}
          onClick={() =>
            setIndex((value) => Math.min(FRAMES.length - 1, value + 1))
          }
        >
          Next
        </button>
      </div>

      <figcaption className="entries-publish__caption">
        CMS-shaped API: create, write content, publish by slug.
      </figcaption>
    </figure>
  );
}
