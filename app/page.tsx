import { AgentKnowMe } from "@/app/components/agent-know-me";
import { HeroCta } from "@/app/components/hero/cta";
import { ExperienceTimeline } from "@/app/components/experience/timeline";
import { PageColumn } from "@/app/components/ui/page-column";
import { ProjectCard } from "@/app/components/projects/project-card";
import { SectionHeading } from "@/app/components/ui/section-heading";
import { WritingEntry } from "@/app/components/writing/entry";
import { homeProjects } from "@/lib/projects/projects";
import { getAgentBriefMarkdown } from "@/lib/site/agent-brief";
import { site, stats } from "@/lib/site/site";
import { getWritingEntries, writingHomePreviewCount } from "@/lib/writing/posts";

export default function Home() {
  const writingEntries = getWritingEntries();
  const brief = getAgentBriefMarkdown();
  return (
    <>
      <PageColumn variant="hero">
        <h1 className="type-h1 m-0">
          Hello, I&apos;m <AgentKnowMe brief={brief} name={site.name} />.
        </h1>
        <p className="type-role mt-6 mb-0">
          I&apos;m a <span className="brand-role">{site.role}</span>{" "}
          working in
          APIs, cloud &amp; backend systems.
        </p>

        <HeroCta />
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <SectionHeading
          title="At a glance"
          action={{ label: "Learn more", href: "/about", external: false }}
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="type-stat-value m-0">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="type-body-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageColumn>

      <PageColumn variant="section" ruleTop className="scroll-mt-20" id="experience">
        <SectionHeading title="Experience" />
        <ExperienceTimeline />
      </PageColumn>

      <PageColumn variant="section" className="scroll-mt-20" id="work">
        <SectionHeading
          title="Projects"
          action={{ label: "View all", href: "/projects", external: false }}
        />
        <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {homeProjects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard project={project} priority={index === 0} />
            </li>
          ))}
        </ul>
      </PageColumn>

      <PageColumn variant="section" ruleTop className="scroll-mt-20">
        <SectionHeading
          title="Writing"
          action={{ label: "View all", href: "/writing", external: false }}
        />
        <div>
          {writingEntries.slice(0, writingHomePreviewCount).map((entry) => (
            <WritingEntry key={entry.slug} entry={entry} />
          ))}
        </div>
      </PageColumn>
    </>
  );
}
