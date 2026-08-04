import fs from "node:fs";
import path from "node:path";

export type WritingPostStatus = "draft" | "published";

export type WritingPost = {
  slug: string;
  title: string;
  date: string;
  status: WritingPostStatus;
  excerpt: string;
  content: string;
};

export type WritingEntry = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

/** How many posts to show in the home Writing section */
export const writingHomePreviewCount = 3;

const writingDirectory = path.join(process.cwd(), "content", "writing");

type WritingFrontmatter = {
  title: string;
  date: string;
  status: WritingPostStatus;
  excerpt: string;
};

function parseFrontmatter(raw: string): {
  data: WritingFrontmatter;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter");
  }

  const [, frontmatterBlock, body] = match;
  const fields: Record<string, string> = {};

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    fields[key] = value;
  }

  const { title, date, status, excerpt } = fields;
  if (
    !title ||
    !date ||
    !excerpt ||
    (status !== "draft" && status !== "published")
  ) {
    throw new Error(
      "Frontmatter requires title, date, excerpt, and status (draft|published)",
    );
  }

  return {
    data: { title, date, status, excerpt },
    content: body.replace(/^\uFEFF/, "").trimStart(),
  };
}

function readWritingPostFile(filename: string): WritingPost {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(writingDirectory, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    status: data.status,
    excerpt: data.excerpt,
    content,
  };
}

function listAllWritingPosts(): WritingPost[] {
  if (!fs.existsSync(writingDirectory)) {
    return [];
  }

  return fs
    .readdirSync(writingDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(readWritingPostFile)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function listPublishedWritingPosts(): WritingPost[] {
  return listAllWritingPosts().filter((post) => post.status === "published");
}

export function getWritingPost(slug: string): WritingPost | null {
  const filename = `${slug}.md`;
  const filePath = path.join(writingDirectory, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return readWritingPostFile(filename);
  } catch {
    return null;
  }
}

export function getPublishedWritingPost(slug: string): WritingPost | null {
  const post = getWritingPost(slug);
  if (!post || post.status !== "published") {
    return null;
  }
  return post;
}

export function formatPostDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function postToWritingEntry(post: WritingPost): WritingEntry {
  return {
    slug: post.slug,
    date: formatPostDate(post.date),
    title: post.title,
    excerpt: post.excerpt,
    href: `/writing/${post.slug}`,
  };
}

export function getWritingEntries(): WritingEntry[] {
  return listPublishedWritingPosts().map(postToWritingEntry);
}
