"use client";

import { useEffect, useState } from "react";
import "./storage-split.css";

type Store = "postgres" | "s3";

type Chip = {
  id: string;
  label: string;
  store: Store;
  inList: boolean;
};

const CHIPS: Chip[] = [
  { id: "slug", label: "slug", store: "postgres", inList: true },
  { id: "title", label: "title", store: "postgres", inList: true },
  { id: "status", label: "status", store: "postgres", inList: true },
  {
    id: "published_at",
    label: "published_at",
    store: "postgres",
    inList: true,
  },
  {
    id: "markdown",
    label: "markdown body",
    store: "s3",
    inList: false,
  },
  {
    id: "images",
    label: "extracted image bytes",
    store: "s3",
    inList: false,
  },
];

type Placement = Record<string, Store | null>;

function emptyPlacement(): Placement {
  return Object.fromEntries(CHIPS.map((chip) => [chip.id, null]));
}

export function EntriesStorageSplit() {
  const [placement, setPlacement] = useState<Placement>(emptyPlacement);
  const [selected, setSelected] = useState<string | null>(null);
  const [shaking, setShaking] = useState<Store | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    if (!shaking) return;
    const timer = window.setTimeout(() => setShaking(null), 450);
    return () => window.clearTimeout(timer);
  }, [shaking]);

  const unplaced = CHIPS.filter((chip) => placement[chip.id] == null);
  const allPlaced = unplaced.length === 0;
  const allCorrect =
    allPlaced &&
    CHIPS.every((chip) => placement[chip.id] === chip.store);

  function tryPlace(chipId: string, store: Store) {
    const chip = CHIPS.find((item) => item.id === chipId);
    if (!chip) return;

    if (chip.store !== store) {
      setShaking(store);
      setSelected(null);
      return;
    }

    setPlacement((prev) => ({ ...prev, [chipId]: store }));
    setSelected(null);
  }

  function reset() {
    setPlacement(emptyPlacement());
    setSelected(null);
    setShaking(null);
    setDragging(null);
  }

  function onZoneActivate(store: Store) {
    if (selected) {
      tryPlace(selected, store);
      return;
    }
    if (dragging) {
      tryPlace(dragging, store);
      setDragging(null);
    }
  }

  return (
    <figure className="entries-split">
      <div className="entries-split__header">
        <div>
          <p className="entries-split__eyebrow">Where’s the body?</p>
          <p className="entries-split__subtitle">
            Drop each field on Postgres or S3. Wrong drops bounce back.
          </p>
        </div>
        {CHIPS.some((chip) => placement[chip.id] != null) ? (
          <button
            type="button"
            className="entries-split__reset"
            onClick={reset}
          >
            Reset
          </button>
        ) : null}
      </div>

      <div className="entries-split__tray" aria-label="Unplaced fields">
        {unplaced.length === 0 ? (
          <p className="entries-split__tray-empty">All fields placed.</p>
        ) : (
          unplaced.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={
                selected === chip.id
                  ? "entries-split__chip is-selected"
                  : "entries-split__chip"
              }
              draggable
              aria-pressed={selected === chip.id}
              onClick={() =>
                setSelected((prev) => (prev === chip.id ? null : chip.id))
              }
              onDragStart={(event) => {
                setDragging(chip.id);
                setSelected(chip.id);
                event.dataTransfer.setData("text/plain", chip.id);
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => setDragging(null)}
            >
              {chip.label}
            </button>
          ))
        )}
      </div>

      <div className="entries-split__zones">
        {(["postgres", "s3"] as const).map((store) => {
          const placedHere = CHIPS.filter(
            (chip) => placement[chip.id] === store,
          );
          return (
            <div
              key={store}
              className={
                shaking === store
                  ? "entries-split__zone is-shake"
                  : selected
                    ? "entries-split__zone is-target"
                    : "entries-split__zone"
              }
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                event.preventDefault();
                const chipId =
                  event.dataTransfer.getData("text/plain") || dragging;
                if (chipId) tryPlace(chipId, store);
                setDragging(null);
              }}
            >
              <button
                type="button"
                className="entries-split__zone-hit"
                onClick={() => onZoneActivate(store)}
                aria-label={`Place on ${store === "postgres" ? "Postgres" : "S3"}`}
              >
                <span className="entries-split__zone-title">
                  {store === "postgres" ? "Postgres" : "S3"}
                </span>
                <span className="entries-split__zone-hint">
                  {store === "postgres"
                    ? "Queryable metadata"
                    : "posts/{slug}.md + images"}
                </span>
              </button>
              <ul className="entries-split__placed">
                {placedHere.map((chip) => (
                  <li key={chip.id} className="entries-split__placed-chip">
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {allCorrect ? (
        <p className="entries-split__reveal" aria-live="polite">
          List responses carry{" "}
          {CHIPS.filter((chip) => chip.inList)
            .map((chip) => chip.label)
            .join(", ")}
          . Markdown and images stay behind{" "}
          <code>GET /posts/{"{slug}"}/content</code>.
        </p>
      ) : null}

      <figcaption className="entries-split__caption">
        Metadata left, blobs right. Click a chip then a store if drag is awkward.
      </figcaption>
    </figure>
  );
}
