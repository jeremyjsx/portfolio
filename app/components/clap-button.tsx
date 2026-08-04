"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CLAP_MAX_PER_VISITOR } from "@/lib/writing/claps-constants";

type ClapCounts = {
  total: number;
  mine: number;
};

const PARTICLE_COUNT = 5;

function ClapIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 512 512"
      aria-hidden
      className="clap-button__icon"
    >
      <path
        d="M336 16l0 64c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64c0-8.8 7.2-16 16-16s16 7.2 16 16zm-98.7 7.1l32 48c4.9 7.4 2.9 17.3-4.4 22.2s-17.3 2.9-22.2-4.4l-32-48c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4zM135 119c9.4-9.4 24.6-9.4 33.9 0L292.7 242.7c10.1 10.1 27.3 2.9 27.3-11.3l0-39.4c0-17.7 14.3-32 32-32s32 14.3 32 32l0 153.6c0 57.1-30 110-78.9 139.4c-64 38.4-145.8 28.3-198.5-24.4L7 361c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l53 53c6.1 6.1 16 6.1 22.1 0s6.1-16 0-22.1L23 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l93 93c6.1 6.1 16 6.1 22.1 0s6.1-16 0-22.1L55 185c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l117 117c6.1 6.1 16 6.1 22.1 0s6.1-16 0-22.1l-93-93c-9.4-9.4-9.4-24.6 0-33.9zM433.1 484.9c-24.2 14.5-50.9 22.1-77.7 23.1c48.1-39.6 76.6-99 76.6-162.4l0-98.1c8.2-.1 16-6.4 16-16l0-39.4c0-17.7 14.3-32 32-32s32 14.3 32 32l0 153.6c0 57.1-30 110-78.9 139.4zM424.9 18.7c7.4 4.9 9.3 14.8 4.4 22.2l-32 48c-4.9 7.4-14.8 9.3-22.2 4.4s-9.3-14.8-4.4-22.2l32-48c4.9-7.4 14.8-9.3 22.2-4.4z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function playClapTone(pitch = 1) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200 * pitch, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio is optional.
  }
}

export function ClapButton({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<ClapCounts>({ total: 0, mine: 0 });
  const [burstKey, setBurstKey] = useState(0);
  const [showPlus, setShowPlus] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [capHint, setCapHint] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const capHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pitchRef = useRef(1);
  const pitchReset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(0);
  const countsRef = useRef<ClapCounts>({ total: 0, mine: 0 });

  useEffect(() => {
    countsRef.current = counts;
  }, [counts]);

  const showCapLimitHint = useCallback(() => {
    setCapHint(true);
    if (capHintTimer.current) {
      clearTimeout(capHintTimer.current);
    }
    capHintTimer.current = setTimeout(() => setCapHint(false), 2500);
  }, []);

  const flush = useCallback(async () => {
    const amount = pending.current;
    if (amount <= 0) {
      return;
    }
    pending.current = 0;

    try {
      const response = await fetch(`/api/claps/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as ClapCounts;
      setCounts((prev) => {
        const queued = pending.current;
        const next = {
          total: Math.max(prev.total, data.total + queued),
          mine: Math.max(prev.mine, data.mine + queued),
        };
        countsRef.current = next;
        return next;
      });
    } catch {
      // Keep optimistic UI.
    }
  }, [slug]);

  const queueClap = useCallback(() => {
    const current = countsRef.current;
    if (current.mine >= CLAP_MAX_PER_VISITOR) {
      showCapLimitHint();
      return;
    }

    const next = { total: current.total + 1, mine: current.mine + 1 };
    countsRef.current = next;
    setCounts(next);
    pending.current += 1;
    setBurstKey((key) => key + 1);
    setShowPlus(true);
    setPressed(true);
    window.setTimeout(() => setPressed(false), 120);

    playClapTone(pitchRef.current);
    pitchRef.current = Math.min(pitchRef.current + 0.06, 1.8);
    if (pitchReset.current) {
      clearTimeout(pitchReset.current);
    }
    pitchReset.current = setTimeout(() => {
      pitchRef.current = 1;
    }, 2000);

    if (plusTimer.current) {
      clearTimeout(plusTimer.current);
    }
    plusTimer.current = setTimeout(() => setShowPlus(false), 700);

    if (flushTimer.current) {
      clearTimeout(flushTimer.current);
    }
    flushTimer.current = setTimeout(() => {
      void flush();
    }, 600);

    if (next.mine >= CLAP_MAX_PER_VISITOR) {
      showCapLimitHint();
    }
  }, [flush, showCapLimitHint]);

  const stopHold = useCallback(() => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const startHold = useCallback(() => {
    queueClap();
    stopHold();
    holdTimer.current = setInterval(() => {
      queueClap();
    }, 120);
  }, [queueClap, stopHold]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/claps/${encodeURIComponent(slug)}`);
        if (!response.ok || cancelled) {
          return;
        }
        const data = (await response.json()) as ClapCounts;
        if (!cancelled) {
          const queued = pending.current;
          setCounts({
            total: data.total + queued,
            mine: data.mine + queued,
          });
        }
      } catch {
        // Keep the initial zero counts.
      }
    }

    void load();

    return () => {
      cancelled = true;
      stopHold();
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
      }
      if (plusTimer.current) {
        clearTimeout(plusTimer.current);
      }
      if (pitchReset.current) {
        clearTimeout(pitchReset.current);
      }
      if (capHintTimer.current) {
        clearTimeout(capHintTimer.current);
      }
      if (pending.current > 0) {
        void flush();
      }
    };
  }, [slug, stopHold, flush]);

  const atCap = counts.mine >= CLAP_MAX_PER_VISITOR;
  const active = counts.mine > 0;

  return (
    <div className="clap-button">
      <div className="clap-button__stage">
        <button
          type="button"
          className={`clap-button__control${active ? " clap-button__control--active" : ""}${pressed ? " clap-button__control--pressed" : ""}`}
          aria-label={
            atCap
              ? `Clap limit reached. ${counts.total} claps total.`
              : `Clap for this post. ${counts.total} claps total.`
          }
          onPointerDown={(event) => {
            if (event.button !== 0) {
              return;
            }
            event.preventDefault();
            startHold();
          }}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              queueClap();
            }
          }}
        >
          <ClapIcon active={active} />
          {burstKey > 0 ? (
            <span className="clap-button__burst" key={burstKey} aria-hidden>
              {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
                <span
                  key={index}
                  className="clap-button__particle"
                  style={
                    {
                      "--clap-angle": `${(index * 360) / PARTICLE_COUNT}deg`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          ) : null}
        </button>

        {showPlus && counts.mine > 0 ? (
          <span className="clap-button__plus" key={`plus-${counts.mine}`} aria-hidden>
            +{counts.mine}
          </span>
        ) : null}
      </div>

      <p className="clap-button__meta">
        <span className="clap-button__count">{counts.total}</span>
        <span>claps</span>
      </p>

      <p
        className={`clap-button__hint${capHint ? " clap-button__hint--visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {capHint ? `Limit reached (${CLAP_MAX_PER_VISITOR} claps)` : "\u00a0"}
      </p>
    </div>
  );
}
