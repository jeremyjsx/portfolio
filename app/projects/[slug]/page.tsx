import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowIcon } from "@/app/components/icons/arrow-icon";
import { PageColumn } from "@/app/components/ui/page-column";
import { ProjectCaseActions } from "@/app/components/projects/project-case-actions";
import { ProjectCaseBody } from "@/app/components/projects/project-case-body";
import { getProjectCaseStudy } from "@/lib/projects/cases";
import { getProjectBySlug, projects } from "@/lib/projects/projects";
import { site } from "@/lib/site/site";

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
    return { title: `Projects - ${site.fullName}` };
  }

  return {
    title: `${project.name} - ${site.fullName}`,
    description: project.description,
  };
}

function CaseStudyProseSkeleton() {
  return (
    <div className="project-case__prose-skeleton" aria-hidden>
      <div className="mb-3 h-[1.8rem] w-32 rounded bg-surface" />
      <div className="flex flex-col gap-2">
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[600px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[560px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[480px] rounded bg-surface" />
      </div>
      <div className="mt-8 mb-3 h-[1.8rem] w-40 rounded bg-surface" />
      <div className="flex flex-col gap-2">
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[580px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[520px] rounded bg-surface" />
      </div>
      <div className="mt-8 mb-3 h-[1.8rem] w-36 rounded bg-surface" />
      <div className="flex flex-col gap-2">
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[590px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[540px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[460px] rounded bg-surface" />
      </div>
    </div>
  );
}

function CaseStudyFallback() {
  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <div className="mb-4 h-[1.1rem] w-48 rounded bg-surface" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <div
            className="h-[clamp(1.76rem,4vw,2.5rem)] max-w-[640px] w-[min(15rem,52%)] rounded bg-surface"
            aria-hidden
          />
          <div className="flex shrink-0 gap-2" aria-hidden>
            <div className="project-case__action-skel rounded-md bg-surface" />
            <div className="project-case__action-skel rounded-md bg-surface" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" aria-hidden>
          <div className="h-7 w-16 rounded-full bg-surface" />
          <div className="h-7 w-[5.25rem] rounded-full bg-surface" />
        </div>
        <div className="mt-6 h-[1.3rem] w-32 rounded bg-surface" aria-hidden />
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <div
          className="project-case__banner project-case__banner--skeleton"
          aria-hidden
        />
        <CaseStudyProseSkeleton />
      </PageColumn>
    </>
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

        <div className="project-case__title-row">
          <h1 className="type-h1 m-0 min-w-0 max-w-[640px]">{project.name}</h1>
          <ProjectCaseActions
            projectName={project.name}
            githubHref={project.href}
            sites={project.sites}
          />
        </div>

        <ul className="project-case__stack m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
          {project.stack.map((item) => (
            <li key={item} className="project-case__stack-item">
              {item}
            </li>
          ))}
        </ul>

        <p className="type-body-sm m-0 mt-6">
          <Link href="/projects" className="link-arrow text-muted">
            <ArrowIcon direction="left" />
            Back to projects
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        {project.banner ? (
          <div className="project-case__banner">
            <Image
              src={project.banner}
              alt={`${project.name} banner`}
              width={1200}
              height={500}
              className="project-case__banner-img"
              priority
              loading="eager"
            />
          </div>
        ) : null}
        <Suspense fallback={<CaseStudyProseSkeleton />}>
          <div
            className={
              project.banner
                ? "project-case__body project-case__body--after-banner"
                : "project-case__body"
            }
          >
            <ProjectCaseBody content={caseStudy} />
          </div>
        </Suspense>
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
