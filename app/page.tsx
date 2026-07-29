import { HeroCta } from "@/app/components/hero-cta";
import { ExperienceTimeline } from "@/app/components/experience-timeline";
import { PageColumn } from "@/app/components/page-column";
import { ProjectCard } from "@/app/components/project-card";
import { SectionHeading } from "@/app/components/section-heading";
import { WritingEntry } from "@/app/components/writing-entry";
import { homeProjects } from "@/lib/projects";
import { site, stats } from "@/lib/site";
import { getWritingEntries, writingHomePreviewCount } from "@/lib/writing";

export default async function Home() {
  const writingEntries = await getWritingEntries();
  return (
    <>
      <PageColumn variant="hero">
        <h1 className="type-h1 m-0">Hello, I&apos;m {site.name}.</h1>
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
          action={{ label: "View all", href: "/work", external: false }}
        />
        <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {homeProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
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
