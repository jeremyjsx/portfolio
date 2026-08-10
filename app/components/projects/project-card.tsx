import "./project-chrome.css";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects/projects";

type ProjectCardProps = {
  project: Project;
  /** Eager-load banner when this card is likely LCP (above the fold). */
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block text-foreground no-underline"
    >
      <div className="project-card__media mb-4 aspect-[12/5] overflow-hidden rounded-sm bg-surface transition-colors group-hover:bg-surface-hover">
        {project.banner ? (
          <Image
            src={project.banner}
            alt=""
            width={1200}
            height={500}
            className="project-card__banner"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <span className="flex h-full items-end p-5 text-4xl" aria-hidden>
            {project.emoji}
          </span>
        )}
      </div>
      <h3 className="mb-1 font-display text-base font-normal tracking-tight group-hover:opacity-70">
        {project.name}
      </h3>
      <p className="type-body-sm m-0">{project.category}</p>
    </Link>
  );
}
