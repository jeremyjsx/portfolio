import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ClapButton } from "@/app/components/clap-button";
import { PageColumn } from "@/app/components/page-column";
import { WritingMarkdown } from "@/app/components/writing-markdown";
import { WritingViewTracker } from "@/app/components/writing-view-tracker";
import {
  formatPostDate,
  formatReadingTime,
  getPublishedWritingPost,
  listPublishedWritingPosts,
} from "@/lib/writing/posts";
import { site } from "@/lib/site/site";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listPublishedWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedWritingPost(slug);

  if (!post) {
    return { title: `Writing — ${site.fullName}` };
  }

  return {
    title: `${post.title} — ${site.fullName}`,
    description: post.excerpt || post.title,
  };
}

function WritingProseSkeleton() {
  return (
    <div className="flex min-h-[32rem] flex-col gap-8" aria-hidden>
      <div className="flex flex-col gap-3">
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[600px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[620px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[480px] rounded bg-surface" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="mb-1 h-[1.5rem] w-40 rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[580px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[610px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[520px] rounded bg-surface" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="mb-1 h-[1.5rem] w-52 rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[590px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[560px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[440px] rounded bg-surface" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-[1.22rem] w-full max-w-[640px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[570px] rounded bg-surface" />
        <div className="h-[1.22rem] w-full max-w-[500px] rounded bg-surface" />
      </div>
    </div>
  );
}

function WritingPostFallback() {
  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <div
          className="mb-4 h-[1.05rem] w-24 rounded bg-surface"
          aria-hidden
        />
        <div className="flex max-w-[640px] flex-col gap-2" aria-hidden>
          <div className="h-[clamp(1.76rem,4vw,2.5rem)] w-full rounded bg-surface" />
          <div className="h-[clamp(1.76rem,4vw,2.5rem)] w-[72%] rounded bg-surface" />
        </div>
        <div className="mt-6 h-[1.05rem] w-28 rounded bg-surface" aria-hidden />
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <WritingProseSkeleton />
      </PageColumn>
    </>
  );
}

async function WritingPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPublishedWritingPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <WritingViewTracker slug={post.slug} />
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <p className="type-body-sm mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{formatReadingTime(post.readingMinutes)}</span>
        </p>
        <h1 className="type-h1 mb-0 max-w-[640px]">{post.title}</h1>
        <p className="type-body-sm mt-6 mb-0">
          <Link href="/writing" className="link-arrow text-muted">
            ← Back to writing
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <Suspense fallback={<WritingProseSkeleton />}>
          <WritingMarkdown content={post.content} />
        </Suspense>
        <ClapButton slug={post.slug} />
      </PageColumn>
    </>
  );
}

export default function WritingPostPage({ params }: WritingPostPageProps) {
  return (
    <Suspense fallback={<WritingPostFallback />}>
      <WritingPostContent params={params} />
    </Suspense>
  );
}
