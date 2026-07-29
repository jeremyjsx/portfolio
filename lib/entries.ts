import { cacheLife } from "next/cache";
import {
  getMockPostBySlug,
  getMockPostContent,
  mockWritingPosts,
  shouldUseWritingMock,
} from "@/lib/writing-mock";

export type EntriesPost = {
  id: string;
  title: string;
  slug: string;
  s3_key: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type EntriesListResult = {
  data: EntriesPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

const DEFAULT_ENTRIES_API_URL = "http://localhost:8080";

function getEntriesApiUrl(): string {
  return process.env.ENTRIES_API_URL?.replace(/\/$/, "") ?? DEFAULT_ENTRIES_API_URL;
}

export async function listPublishedPosts(): Promise<EntriesPost[]> {
  if (shouldUseWritingMock()) {
    return mockWritingPosts;
  }

  return listPublishedPostsCached();
}

async function listPublishedPostsCached(): Promise<EntriesPost[]> {
  "use cache";
  cacheLife("minutes");

  try {
    const url = new URL("/posts", getEntriesApiUrl());
    url.searchParams.set("status", "published");
    url.searchParams.set("per_page", "50");

    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as EntriesListResult;
    return result.data ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<EntriesPost | null> {
  if (shouldUseWritingMock()) {
    return getMockPostBySlug(slug);
  }

  return getPostBySlugCached(slug);
}

async function getPostBySlugCached(slug: string): Promise<EntriesPost | null> {
  "use cache";
  cacheLife("minutes");

  try {
    const response = await fetch(
      `${getEntriesApiUrl()}/posts/${encodeURIComponent(slug)}`,
    );
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as EntriesPost;
  } catch {
    return null;
  }
}

export async function getPostContent(slug: string): Promise<string | null> {
  if (shouldUseWritingMock()) {
    return getMockPostContent(slug);
  }

  return getPostContentCached(slug);
}

async function getPostContentCached(slug: string): Promise<string | null> {
  "use cache";
  cacheLife("minutes");

  try {
    const response = await fetch(
      `${getEntriesApiUrl()}/posts/${encodeURIComponent(slug)}/content`,
    );
    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  }
}

export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function excerptFromMarkdown(markdown: string, maxLength = 180): string {
  const paragraph = markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!paragraph) {
    return "";
  }

  return paragraph.length > maxLength
    ? `${paragraph.slice(0, maxLength).trimEnd()}…`
    : paragraph;
}
