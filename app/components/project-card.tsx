import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block text-foreground no-underline"
    >
      <div className="mb-4 flex aspect-[4/3] items-end overflow-hidden rounded-sm bg-surface p-5 transition-colors group-hover:bg-surface-hover">
        <span className="text-4xl" aria-hidden>
          {project.emoji}
        </span>
      </div>
      <h3 className="mb-1 font-display text-base font-normal tracking-tight group-hover:opacity-70">
        {project.name}
      </h3>
      <p className="type-body-sm m-0">{project.category}</p>
    </Link>
  );
}
