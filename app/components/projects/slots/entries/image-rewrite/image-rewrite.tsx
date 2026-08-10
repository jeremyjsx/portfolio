"use client";

import { useId, useState } from "react";
import "./image-rewrite.css";

const SLUG = "hello-world";
const IMAGE_UUID = "a1b2c3d4";
const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const BEFORE = `# Hello

![diagram](data:image/png;base64,${TINY_PNG})

More text.`;

const AFTER = `# Hello

![diagram](https://entries.local/posts/${SLUG}/images/${IMAGE_UUID}.png)

More text.`;

const BUCKET = [
  `posts/${SLUG}.md`,
  `posts/${SLUG}/images/${IMAGE_UUID}.png`,
];

export function EntriesImageRewrite() {
  const [saved, setSaved] = useState(false);
  const labelId = useId();

  return (
    <figure className="entries-rewrite">
      <div className="entries-rewrite__header">
        <div>
          <p className="entries-rewrite__eyebrow">Base64 → S3 URL</p>
          <p className="entries-rewrite__subtitle">
            Save a draft with an embedded image. Bytes leave; the markdown keeps
            a link.
          </p>
        </div>
        <div className="entries-rewrite__actions">
          <button
            type="button"
            className="entries-rewrite__btn is-primary"
            onClick={() => setSaved(true)}
            disabled={saved}
          >
            Save
          </button>
          {saved ? (
            <button
              type="button"
              className="entries-rewrite__btn"
              onClick={() => setSaved(false)}
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <div className="entries-rewrite__grid">
        <div className="entries-rewrite__pane">
          <p className="entries-rewrite__label" id={`${labelId}-before`}>
            Before write
          </p>
          <pre
            className="entries-rewrite__code"
            tabIndex={0}
            aria-labelledby={`${labelId}-before`}
          >
            <code>{BEFORE}</code>
          </pre>
        </div>

        <div className="entries-rewrite__pane">
          <p className="entries-rewrite__label" id={`${labelId}-after`}>
            After save
          </p>
          {saved ? (
            <>
              <pre
                className="entries-rewrite__code is-rewritten"
                tabIndex={0}
                aria-labelledby={`${labelId}-after`}
              >
                <code>{AFTER}</code>
              </pre>
              <p className="entries-rewrite__bucket-label">Bucket objects</p>
              <ul className="entries-rewrite__bucket">
                {BUCKET.map((key) => (
                  <li key={key}>
                    <code>{key}</code>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="entries-rewrite__placeholder" aria-live="polite">
              <span>
                Hit Save to rewrite the data URI and land objects under
              </span>
              <code>posts/{SLUG}/</code>
            </div>
          )}
        </div>
      </div>

      <figcaption className="entries-rewrite__caption">
        Same storage interface against LocalStack or real S3. Keys match the
        service: <code>posts/{"{slug}"}.md</code>,{" "}
        <code>posts/{"{slug}"}/images/{"{uuid}"}.{"{ext}"}</code>.
      </figcaption>
    </figure>
  );
}
