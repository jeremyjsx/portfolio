import { getAgentBriefMarkdown } from "@/lib/site/agent-brief";

export function GET() {
  const body = getAgentBriefMarkdown();

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="jeremy-mosquera-agent-brief.md"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
