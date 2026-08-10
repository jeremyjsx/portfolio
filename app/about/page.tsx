import "./about.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/app/components/icons/arrow-icon";
import { PageColumn } from "@/app/components/ui/page-column";
import { aboutPage } from "@/lib/about/about";
import { site } from "@/lib/site/site";

export const metadata: Metadata = {
  title: `About - ${site.fullName}`,
  description: aboutPage.lead,
};

export default function AboutPage() {
  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage about-hero">
        <h1 className="type-h1 m-0">{aboutPage.title}</h1>
        <p className="type-body mt-4 mb-0 max-w-[390px]">{aboutPage.lead}</p>
        <p className="type-body-sm mt-3 mb-0">
          <Link href="/" className="link-arrow text-muted">
            <ArrowIcon direction="left" />
            Back to home
          </Link>
        </p>
      </PageColumn>

      {aboutPage.sections.map((section, index) => (
        <PageColumn
          key={section.id}
          variant="section-tight"
          ruleTop={index === 0}
          className="about-section"
        >
          <h2 className="type-section-title m-0 mb-2">{section.title}</h2>
          <div className="about-section-copy">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={`${section.id}-${paragraphIndex}`}
                className="type-body m-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </PageColumn>
      ))}
    </>
  );
}
