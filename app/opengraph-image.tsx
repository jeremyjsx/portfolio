import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.fullName} — ${site.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "app/fonts/og");

const [exposureRegular, exposureItalic, interRegular] = await Promise.all([
  readFile(join(fontsDir, "exposure-regular.ttf")),
  readFile(join(fontsDir, "exposure-italic.ttf")),
  readFile(join(fontsDir, "Inter-Regular.ttf")),
]);

// Shared dash grid: phase so crossings form +, segments clip to canvas edges.
// Edge stubs end up 3px vs 2px (5-on/5-off can't mirror on a period-10 grid);
// that's fine — keeps the + joins and full-bleed rails.
const RAIL_INSET = 60;
const DASH = 5;
const PERIOD = 10;
const PHASE =
  (((RAIL_INSET - Math.floor(DASH / 2)) % PERIOD) + PERIOD) % PERIOD;

function dashSegments(span: number): { start: number; length: number }[] {
  const segments: { start: number; length: number }[] = [];
  let pos = PHASE;
  while (pos > 0) pos -= PERIOD;

  for (; pos < span; pos += PERIOD) {
    const start = Math.max(0, pos);
    const end = Math.min(span, pos + DASH);
    if (end > start) segments.push({ start, length: end - start });
  }
  return segments;
}

/** Dashed rail — Satori has weak border-style support, so we fake dashes. */
function DashedRail({
  orientation,
  edge,
}: {
  orientation: "vertical" | "horizontal";
  edge: "left" | "right" | "top" | "bottom";
}) {
  const isVertical = orientation === "vertical";
  const span = isVertical ? size.height : size.width;
  const segments = dashSegments(span);

  const railLeft =
    edge === "left"
      ? RAIL_INSET
      : edge === "right"
        ? size.width - RAIL_INSET
        : 0;
  const railTop =
    edge === "top"
      ? RAIL_INSET
      : edge === "bottom"
        ? size.height - RAIL_INSET
        : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: railLeft,
        top: railTop,
        width: isVertical ? 1 : span,
        height: isVertical ? span : 1,
        display: "flex",
      }}
    >
      {segments.map(({ start, length }) => (
        <div
          key={`dash-${edge}-${start}`}
          style={{
            position: "absolute",
            left: isVertical ? 0 : start,
            top: isVertical ? start : 0,
            width: isVertical ? 1 : length,
            height: isVertical ? length : 1,
            background: "#2a2a2a",
            display: "flex",
          }}
        />
      ))}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ffffff",
          padding: "88px",
          position: "relative",
        }}
      >
        <DashedRail orientation="vertical" edge="left" />
        <DashedRail orientation="vertical" edge="right" />
        <DashedRail orientation="horizontal" edge="top" />
        <DashedRail orientation="horizontal" edge="bottom" />

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Exposure",
              fontSize: 72,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
            }}
          >
            <div style={{ display: "flex" }}>{site.footer.headline[0]}</div>
            <div
              style={{
                display: "flex",
                fontFamily: "Exposure Italic",
                color: "#60b4ff",
              }}
            >
              {site.footer.headline[1]}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              width: 980,
            }}
          >
            {site.footer.focusAreas.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #2a2a2a",
                  borderRadius: 9999,
                  padding: "10px 18px",
                  fontFamily: "Inter",
                  fontSize: 20,
                  lineHeight: 1.2,
                  color: "#9ba1a5",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Exposure",
                fontSize: 36,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {site.fullName}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 20,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {`${site.role} · ${site.location}`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 22,
                color: "#ffffff",
              }}
            >
              {"Let's chat →"}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 18,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              LinkedIn · GitHub · CV
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Exposure",
          data: exposureRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Exposure Italic",
          data: exposureItalic,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
