import {
  excerptFromMarkdown,
  formatPostDate,
  getPostContent,
  listPublishedPosts,
  type EntriesPost,
} from "@/lib/entries";

export type WritingEntry = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

/** How many posts to show in the home Writing section */
export const writingHomePreviewCount = 3;

async function postToWritingEntry(post: EntriesPost): Promise<WritingEntry> {
  const content = await getPostContent(post.slug);
  const excerpt = content ? excerptFromMarkdown(content) : "";

  return {
    slug: post.slug,
    date: formatPostDate(post.updated_at),
    title: post.title,
    excerpt,
    href: `/writing/${post.slug}`,
  };
}

export async function getWritingEntries(): Promise<WritingEntry[]> {
  const posts = await listPublishedPosts();
  return Promise.all(posts.map(postToWritingEntry));
}
