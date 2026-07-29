import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageColumn } from "@/app/components/page-column";
import { WritingMarkdown } from "@/app/components/writing-markdown";
import {
  formatPostDate,
  getPostBySlug,
  getPostContent,
  listPublishedPosts,
} from "@/lib/entries";
import { site } from "@/lib/site";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    return { title: `Writing — ${site.fullName}` };
  }

  return {
    title: `${post.title} — ${site.fullName}`,
    description: post.title,
  };
}

function WritingPostFallback() {
  return (
    <PageColumn variant="hero" className="page-column-hero--subpage">
      <div className="h-4 w-28 rounded bg-surface" aria-hidden />
      <div className="mt-6 h-10 max-w-[640px] rounded bg-surface" aria-hidden />
    </PageColumn>
  );
}

async function WritingPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, content] = await Promise.all([
    getPostBySlug(slug),
    getPostContent(slug),
  ]);

  if (!post || post.status !== "published" || !content) {
    notFound();
  }

  return (
    <>
      <PageColumn variant="hero" className="page-column-hero--subpage">
        <time className="type-body-sm mb-4 block">
          {formatPostDate(post.updated_at)}
        </time>
        <h1 className="type-h1 m-0 max-w-[640px]">{post.title}</h1>
        <p className="type-body-sm mt-6 mb-0">
          <Link href="/writing" className="link-arrow text-muted">
            ← Back to writing
          </Link>
        </p>
      </PageColumn>

      <PageColumn variant="section" ruleTop>
        <WritingMarkdown content={content} />
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
