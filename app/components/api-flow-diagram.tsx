import { apiFlowMethods, apiFlowTags } from "@/lib/about/about";

function MethodIcon() {
  return (
    <svg
      className="api-flow__method-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v8c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="api-flow__sparkle"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l1.2 4.4L17.6 8l-4.4 1.2L12 14l-1.2-4.8L6.4 8l4.4-1.6L12 2zm0 10l.9 3.4L16.3 16l-3.4.9L12 20l-.9-3.7L7.7 16l3.4-1.1L12 12z" />
    </svg>
  );
}

function TagIcon({ type }: { type: "queue" | "folder" }) {
  if (type === "folder") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 7h5l2 2h9v10H4V7z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 6h12v3H6zm0 5h8v3H6zm0 5h10v3H6z" />
    </svg>
  );
}

export function ApiFlowDiagram() {
  return (
    <figure className="api-flow" aria-labelledby="api-flow-caption">
      <div className="api-flow__methods" role="list">
        {apiFlowMethods.map((method) => (
          <span key={method} className="api-flow__pill" role="listitem">
            <MethodIcon />
            {method}
          </span>
        ))}
      </div>

      <svg
        className="api-flow__wires"
        viewBox="0 0 560 72"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M70 4 C70 36, 280 40, 280 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M210 4 C210 36, 280 40, 280 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M350 4 C350 36, 280 40, 280 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M490 4 C490 36, 280 40, 280 68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="api-flow__bridge">
        <span className="api-flow__pill api-flow__pill--wide">
          <SparkleIcon />
          Data exchange using a customized REST API
        </span>
      </div>

      <div className="api-flow__stage">
        <svg className="api-flow__waves" viewBox="0 0 560 200" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M ${80 + i * 12} 190 Q 280 ${150 - i * 22} 480 ${190 - i * 4}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity={0.35 + i * 0.08}
            />
          ))}
        </svg>
        <div className="api-flow__core">API</div>
        <div className="api-flow__tags">
          {apiFlowTags.map((tag) => (
            <span key={tag.label} className="api-flow__pill api-flow__pill--tag">
              <TagIcon type={tag.icon} />
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <figcaption id="api-flow-caption" className="sr-only">
        REST API flow from HTTP methods to backend services
      </figcaption>
    </figure>
  );
}
