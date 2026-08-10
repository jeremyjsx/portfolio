import { getAgentBriefMarkdown } from "@/lib/site/agent-brief";

export function GET() {
  const body = getAgentBriefMarkdown();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
