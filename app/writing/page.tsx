import type { Metadata } from "next";
import Link from "next/link";
import { PageColumn } from "@/app/components/page-column";
import { WritingEntry } from "@/app/components/writing-entry";
import { site } from "@/lib/site";
import { getWritingEntries } from "@/lib/writing";

export const metadata: Metadata = {
  title: `Writing — ${site.fullName}`,
  description:
    "Notes on APIs, databases, and backend systems — idempotency, Postgres, Go workers, and more.",
};

export default async function WritingPage() {
  const writingEntries = await getWritingEntries();

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
            No published posts yet. Publish markdown in{" "}
            <a
              href="https://github.com/jeremyjsx/entries"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground no-underline transition-opacity hover:opacity-70"
            >
              entries
            </a>{" "}
            and they will show up here.
          </p>
        )}
      </PageColumn>
    </>
  );
}
