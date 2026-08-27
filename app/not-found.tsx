import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/app/components/icons/arrow-icon";
import { PageColumn } from "@/app/components/ui/page-column";
import { site } from "@/lib/site/site";

export const metadata: Metadata = {
  title: `Page not found - ${site.fullName}`,
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <PageColumn variant="hero" className="page-column-hero--subpage">
      <h1 className="type-stat-value m-0">404</h1>
      <p className="type-body mt-6 mb-0 max-w-[390px]">
        This page doesn&apos;t exist.
      </p>
      <p className="type-body-sm mt-4 mb-0">
        <Link href="/" className="link-arrow text-muted">
          <ArrowIcon direction="left" />
          Back to home
        </Link>
      </p>
    </PageColumn>
  );
}
