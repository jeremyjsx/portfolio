import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/app/components/icons/arrow-icon";
import { PageColumn } from "@/app/components/ui/page-column";
import { ProjectCard } from "@/app/components/projects/project-card";
import { projects } from "@/lib/projects/projects";
import { site } from "@/lib/site/site";

export const metadata: Metadata = {
  title: `Projects - ${site.fullName}`,
  description:
    "Backend systems, pipelines, and open source - e-commerce APIs, RSS intelligence, and workflow tooling.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <h1 className="type-h1 m-0">Projects</h1>
        <p className="type-body mt-6 mb-0 max-w-[390px]">
          Selected projects - production backends, side experiments, and open
          source tooling.
        </p>
        <p className="type-body-sm mt-4 mb-0">
          <Link href="/" className="link-arrow text-muted">
            <ArrowIcon direction="left" />
            Back to home
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard project={project} priority={index === 0} />
            </li>
          ))}
        </ul>
      </PageColumn>
    </>
  );
}
