import "./focus-marquee.css";
const SEPARATOR = "·";

function MarqueeCells({
  cells,
  keyPrefix,
}: {
  cells: readonly string[];
  keyPrefix: string;
}) {
  return cells.map((cell, i) =>
    cell === SEPARATOR ? (
      <span
        key={`${keyPrefix}-sep-${i}`}
        className="focus-marquee__dot font-display text-2xl text-muted/40 sm:text-3xl"
      >
        ·
      </span>
    ) : (
      <span
        key={`${keyPrefix}-${cell}-${i}`}
        className="focus-marquee__label font-display text-2xl tracking-tight text-foreground/80 sm:text-3xl md:text-4xl"
      >
        {cell}
      </span>
    ),
  );
}

export function FocusMarquee({ items }: { items: readonly string[] }) {
  const sequence = items.flatMap((item) => [SEPARATOR, item] as const);
  const loop = [...sequence, ...sequence] as const;

  return (
    <div className="focus-marquee">
      <p className="sr-only">{items.join(", ")}</p>
      <div className="focus-marquee__viewport">
        <div className="focus-marquee__track" aria-hidden>
          <MarqueeCells cells={loop} keyPrefix="loop" />
        </div>
      </div>
    </div>
  );
}
