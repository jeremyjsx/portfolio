import type { Metadata } from "next";
import Link from "next/link";
import { ApiFlowDiagram } from "@/app/components/api-flow-diagram";
import { PageColumn } from "@/app/components/page-column";
import { aboutPage } from "@/lib/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${site.fullName}`,
  description: aboutPage.lead,
};

export default function AboutPage() {
  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <h1 className="type-h1 m-0">{aboutPage.title}</h1>
        <p className="type-body mt-6 mb-0 max-w-[390px]">{aboutPage.lead}</p>
        <p className="type-body-sm mt-4 mb-0">
          <Link href="/" className="link-arrow text-muted">
            ← Back to home
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <p className="type-body-sm m-0 mb-6 text-muted">
          {aboutPage.diagramCaption}
        </p>
        <ApiFlowDiagram />
      </PageColumn>

      {aboutPage.sections.map((section) => (
        <PageColumn key={section.id} variant="section">
          <h2 className="type-section-title m-0 mb-4">{section.title}</h2>
          <p className="about-placeholder m-0">{section.body}</p>
        </PageColumn>
      ))}

      <PageColumn variant="section">
        <p className="type-body m-0">
          <a
            href={encodeURI(site.cvPath)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow text-foreground"
          >
            Download CV →
          </a>
        </p>
      </PageColumn>
    </>
  );
}
