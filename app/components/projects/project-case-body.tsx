import "./project-case-prose.css";
import "./project-chrome.css";
import type { ReactNode } from "react";
import { EntriesImageRewrite } from "@/app/components/projects/slots/entries/image-rewrite/image-rewrite";
import { EntriesPublishFlow } from "@/app/components/projects/slots/entries/publish-flow/publish-flow";
import { EntriesStorageSplit } from "@/app/components/projects/slots/entries/storage-split/storage-split";
import { OrderlyCheckoutPath } from "@/app/components/projects/slots/orderly/checkout-path/checkout-path";
import { OrderlyRetryDlq } from "@/app/components/projects/slots/orderly/retry-dlq/retry-dlq";
import { OrderlyStateMachine } from "@/app/components/projects/slots/orderly/state-machine/state-machine";
import { SignalMakeTheCut } from "@/app/components/projects/slots/signal/make-the-cut/make-the-cut";
import { SignalPipelineStepper } from "@/app/components/projects/slots/signal/pipeline-stepper/pipeline-stepper";
import { SignalVaultMedia } from "@/app/components/projects/slots/signal/vault-media/vault-media";
import { WorkflowsCliLoop } from "@/app/components/projects/slots/workflows/cli-loop/cli-loop";
import { WorkflowsCompose } from "@/app/components/projects/slots/workflows/compose/compose";
import { WorkflowsRegistry } from "@/app/components/projects/slots/workflows/registry/registry";
import { WritingMarkdown } from "@/app/components/writing/markdown";

const SLOT_PATTERN = /<!--\s*MEDIA_SLOT:\s*([\w-]+)\s*-->/g;

type CasePart =
  | { type: "markdown"; content: string }
  | { type: "slot"; id: string };

function splitCaseStudyContent(content: string): CasePart[] {
  const parts: CasePart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(SLOT_PATTERN)) {
    const index = match.index ?? 0;
    const markdown = content.slice(lastIndex, index).trim();
    if (markdown) {
      parts.push({ type: "markdown", content: markdown });
    }

    parts.push({ type: "slot", id: match[1] });
    lastIndex = index + match[0].length;
  }

  const trailing = content.slice(lastIndex).trim();
  if (trailing) {
    parts.push({ type: "markdown", content: trailing });
  }

  return parts;
}

function renderSlot(id: string): ReactNode {
  switch (id) {
    case "orderly-1":
      return <OrderlyCheckoutPath />;
    case "orderly-2":
      return <OrderlyRetryDlq />;
    case "orderly-3":
      return <OrderlyStateMachine />;
    case "signal-1":
      return <SignalVaultMedia />;
    case "signal-2":
      return <SignalPipelineStepper />;
    case "signal-3":
      return <SignalMakeTheCut />;
    case "workflows-1":
      return <WorkflowsCompose />;
    case "workflows-2":
      return <WorkflowsCliLoop />;
    case "workflows-3":
      return <WorkflowsRegistry />;
    case "entries-1":
      return <EntriesStorageSplit />;
    case "entries-2":
      return <EntriesImageRewrite />;
    case "entries-3":
      return <EntriesPublishFlow />;
    default:
      return null;
  }
}

export function ProjectCaseBody({ content }: { content: string }) {
  const parts = splitCaseStudyContent(content);

  return (
    <div className="project-case__body-parts">
      {parts.map((part, index) => {
        if (part.type === "markdown") {
          return <WritingMarkdown key={`md-${index}`} content={part.content} />;
        }

        const slot = renderSlot(part.id);
        if (!slot) {
          return null;
        }

        return (
          <div key={`slot-${part.id}`} className="project-case__slot">
            {slot}
          </div>
        );
      })}
    </div>
  );
}
