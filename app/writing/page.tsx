import type { Metadata } from "next";
import Link from "next/link";
import { PageColumn } from "@/app/components/page-column";
import { WritingEntry } from "@/app/components/writing-entry";
import { site } from "@/lib/site/site";
import { getWritingEntries } from "@/lib/writing/posts";

export const metadata: Metadata = {
  title: `Writing — ${site.fullName}`,
  description:
    "Notes on shipping backend systems, certifications, APIs, and the operational side of building with Claude.",
};

export default function WritingPage() {
  const writingEntries = getWritingEntries();

  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <h1 className="type-h1 m-0">Writing</h1>
        <p className="type-body mt-6 mb-0 max-w-[390px]">
          Longer notes on backend craft — APIs, data, and the operational side of
          shipping services.
        </p>
        <p className="type-body-sm mt-4 mb-0">
          <Link href="/" className="link-arrow text-muted">
            ← Back to home
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        {writingEntries.length > 0 ? (
          <div>
            {writingEntries.map((entry) => (
              <WritingEntry key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="type-body m-0 max-w-[390px]">
            No published posts yet.
          </p>
        )}
      </PageColumn>
    </>
  );
}
