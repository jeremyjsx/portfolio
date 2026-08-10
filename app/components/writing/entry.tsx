import Link from "next/link";
import { formatReadingTime, type WritingEntry } from "@/lib/writing/posts";

export function WritingEntry({ entry }: { entry: WritingEntry }) {
  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link href={entry.href} className="block text-foreground no-underline">
        <p className="type-body-sm mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <time>{entry.date}</time>
          <span aria-hidden>·</span>
          <span>{formatReadingTime(entry.readingMinutes)}</span>
        </p>
        <h3 className="mb-2 font-display text-base font-normal leading-snug transition-opacity group-hover:opacity-70">
          {entry.title}
        </h3>
        {entry.excerpt ? (
          <p className="type-body-sm m-0">{entry.excerpt}</p>
        ) : null}
      </Link>
    </article>
  );
}
