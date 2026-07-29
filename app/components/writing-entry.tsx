import Link from "next/link";
import type { WritingEntry } from "@/lib/writing";

export function WritingEntry({ entry }: { entry: WritingEntry }) {
  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link href={entry.href} className="block text-foreground no-underline">
        <time className="type-body-sm mb-2 block">{entry.date}</time>
        <h3 className="mb-2 font-display text-base font-normal leading-snug transition-opacity group-hover:opacity-70">
          {entry.title}
        </h3>
        {entry.excerpt ? (
          <p className="type-body m-0 max-w-[390px]">{entry.excerpt}</p>
        ) : null}
      </Link>
    </article>
  );
}
