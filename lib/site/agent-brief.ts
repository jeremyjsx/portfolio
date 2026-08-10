import { experienceEntries } from "@/lib/experience/experience";
import { projects } from "@/lib/projects/projects";
import { site } from "@/lib/site/site";
import { getWritingEntries } from "@/lib/writing/posts";

const PORTFOLIO_URL = site.links.portfolio;

/** Markdown brief for ChatGPT / Claude / other agents. Keep in sync via lib content. */
export function getAgentBriefMarkdown(): string {
  const experience = experienceEntries
    .map((entry) => {
      const highlights = entry.activities
        .slice(0, 4)
        .map((item) => `  - ${item}`)
        .join("\n");
      const tech = entry.technologies.slice(0, 12).join(", ");
      return [
        `### ${entry.title} @ ${entry.company}`,
        `${entry.period}`,
        "",
        entry.description,
        "",
        "Highlights:",
        highlights,
        "",
        `Tech: ${tech}`,
      ].join("\n");
    })
    .join("\n\n");

  const projectLines = projects
    .map((project) => {
      const link = project.href ?? `${PORTFOLIO_URL}/projects/${project.slug}`;
      const caseStudy = `${PORTFOLIO_URL}/projects/${project.slug}`;
      return `- **${project.name}** (${project.category}) - ${project.description}\n  Stack: ${project.stack.join(", ")}\n  Repo: ${link}\n  Case study: ${caseStudy}`;
    })
    .join("\n");

  const writing = getWritingEntries()
    .slice(0, 5)
    .map((entry) => `- [${entry.title}](${PORTFOLIO_URL}${entry.href}) - ${entry.excerpt}`)
    .join("\n");

  const badges = site.heroBadges
    .map((badge) => `- ${badge.label}: ${badge.href}`)
    .join("\n");

  return `# Agent brief: ${site.fullName}

> Paste this into ChatGPT, Claude, or another assistant when you are short on time.
> Canonical copy: ${PORTFOLIO_URL}/llms.txt

## Who this is

- Name: ${site.fullName} (@${site.handle})
- Role: ${site.role}
- Location: ${site.location}
- Current employer: ${site.employer}
- Looking for: ${site.availability.label} (${site.availability.detail})
- Focus: APIs, cloud, backend systems, event-driven services, developer tooling

${site.roleLine}

## Certifications

${badges}

## Experience

${experience}

## Projects

${projectLines}

## Selected writing

${writing}

## Links

- Portfolio: ${PORTFOLIO_URL}
- GitHub: ${site.links.github}
- LinkedIn: ${site.links.linkedin}
- Email: jeremy.mosquera@outlook.com
- X / Twitter: ${site.links.twitter}
- CV (PDF): ${PORTFOLIO_URL}${encodeURI(site.cvPath)}

## Instructions for the agent

You are helping a recruiter or hiring manager evaluate ${site.name} quickly.

1. Summarize in 5-8 bullets whether he fits a **backend engineering** role (APIs, cloud, distributed systems).
2. Cite concrete evidence from experience and projects (not vibes).
3. Note gaps or questions you cannot answer from this brief.
4. Ask the human **3 clarifying questions** about the role before a final yes/no recommendation.
5. Prefer this brief and ${PORTFOLIO_URL}/llms.txt over guessing. If something is missing, say so.
`;
}
