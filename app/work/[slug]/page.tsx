import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageColumn } from "@/app/components/page-column";
import { WritingMarkdown } from "@/app/components/writing-markdown";
import { getProjectCaseStudy } from "@/lib/project-cases";
import { getProjectBySlug, projects } from "@/lib/projects";
import { site } from "@/lib/site";

type ProjectCasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectCasePageProps): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: `Work — ${site.fullName}` };
  }

  return {
    title: `${project.name} — ${site.fullName}`,
    description: project.description,
  };
}

function CaseStudyFallback() {
  return (
    <PageColumn variant="hero" className="page-column-hero--subpage">
      <div className="h-4 w-40 rounded bg-surface" aria-hidden />
      <div className="mt-6 h-10 max-w-[640px] rounded bg-surface" aria-hidden />
      <div className="mt-6 h-16 max-w-[480px] rounded bg-surface" aria-hidden />
    </PageColumn>
  );
}

async function ProjectCaseContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const caseStudy = getProjectCaseStudy(slug);

  if (!project || !caseStudy) {
    notFound();
  }

  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <p className="type-body-sm m-0 mb-4">
          <span className="mr-2" aria-hidden>
            {project.emoji}
          </span>
          {project.category}
        </p>
        <h1 className="type-h1 m-0 max-w-[640px]">{project.name}</h1>
        <p className="type-body mt-6 mb-0 max-w-[480px]">{project.description}</p>

        <ul className="project-case__stack m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
          {project.stack.map((item) => (
            <li key={item} className="project-case__stack-item">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="type-body-sm m-0">
            <Link href="/work" className="link-arrow text-muted">
              ← Back to work
            </Link>
          </p>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
          >
            View on GitHub →
          </a>
        </div>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <WritingMarkdown content={caseStudy} />
      </PageColumn>
    </>
  );
}

export default function ProjectCasePage({ params }: ProjectCasePageProps) {
  return (
    <Suspense fallback={<CaseStudyFallback />}>
      <ProjectCaseContent params={params} />
    </Suspense>
  );
}
