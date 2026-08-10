import { aboutPage } from "@/lib/about/about";
import { experienceEntries } from "@/lib/experience/experience";
import { projects } from "@/lib/projects/projects";
import { site, stats } from "@/lib/site/site";
import { getWritingEntries } from "@/lib/writing/posts";

const PORTFOLIO_URL = site.links.portfolio;
const email = site.links.email.replace(/^mailto:/i, "");

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
      const live =
        project.sites
          ?.map((s) => `  ${s.label}: ${s.href}`)
          .join("\n") ?? "";
      return [
        `- **${project.name}** (${project.category}) - ${project.description}`,
        `  Stack: ${project.stack.join(", ")}`,
        `  Repo: ${link}`,
        `  Case study: ${caseStudy}`,
        live,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const writing = getWritingEntries()
    .slice(0, 5)
    .map((entry) => `- [${entry.title}](${PORTFOLIO_URL}${entry.href}) - ${entry.excerpt}`)
    .join("\n");

  const badges = site.heroBadges
    .map((badge) => `- ${badge.label}: ${badge.href}`)
    .join("\n");

  const about = aboutPage.sections
    .map((section) => {
      return `### ${section.title}\n\n${section.paragraphs.join("\n\n")}`;
    })
    .join("\n\n");

  const focus = site.footer.focusAreas.join(", ");
  const glance = stats
    .map((stat) => `${stat.value}${stat.suffix} ${stat.label}`)
    .join("; ");

  return `# Agent brief: ${site.fullName}

> Paste this into ChatGPT, Claude, or another assistant when you are short on time.
> Canonical copy: ${PORTFOLIO_URL}/llms.txt

## Who this is

- Name: ${site.fullName} (@${site.handle})
- Role: ${site.role}
- Location: ${site.location}
- Current employer: ${site.employer}
- Looking for: ${site.availability.label} (${site.availability.detail})
- Focus: ${focus}
- At a glance: ${glance}

${site.roleLine}

${aboutPage.lead}

## About

${about}

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
- About: ${PORTFOLIO_URL}/about
- GitHub: ${site.links.github}
- LinkedIn: ${site.links.linkedin}
- Email: ${email}
- X / Twitter: ${site.links.twitter}
- CV (PDF): ${PORTFOLIO_URL}${encodeURI(site.cvPath)}

## Instructions for the agent

You are helping a recruiter or hiring manager evaluate ${site.name} quickly.

1. Summarize in 5-8 bullets whether he fits a **backend engineering** role (APIs, cloud, distributed systems, developer tooling).
2. Cite concrete evidence from About, Experience, and Projects (not vibes).
3. Note gaps or questions you cannot answer from this brief.
4. Ask the human **3 clarifying questions** about the role before a final yes/no recommendation.
5. Prefer this brief and ${PORTFOLIO_URL}/llms.txt over guessing. If something is missing, say so.
`;
}
