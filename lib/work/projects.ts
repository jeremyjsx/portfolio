export type Project = {
  slug: string;
  name: string;
  description: string;
  href?: string;
  stack: string[];
  emoji: string;
  category: string;
  /** Optional cover/banner shown on cards and case study */
  banner?: string;
};

export const projects: Project[] = [
  {
    slug: "orderly",
    name: "orderly",
    emoji: "🛒",
    category: "Backend / E-commerce",
    description:
      "Scalable e-commerce backend with auth, roles, async processing, and real-time order tracking.",
    href: "https://github.com/jeremyjsx/orderly",
    stack: ["Python"],
    banner: "/images/projects/orderly.png",
  },
  {
    slug: "entries",
    name: "entries",
    emoji: "🐈‍⬛",
    category: "Backend / Content",
    description:
      "Event-driven content backend with Markdown publishing and async distribution.",
    href: "https://github.com/jeremyjsx/entries",
    stack: ["Go"],
  },
  {
    slug: "signal",
    name: "signal",
    emoji: "🛰️",
    category: "Backend / AI pipeline",
    description:
      "RSS intelligence pipeline that scores and curates engineering content with AI.",
    href: "https://github.com/jeremyjsx/signal",
    stack: ["Python"],
    banner: "/images/projects/signal.png",
  },
  {
    slug: "workflows",
    name: "workflows",
    emoji: "🌀",
    category: "Open source / Dev tooling",
    description:
      "Programmable financial workflows on the Wallbit API—CLI, Go SDK, and a public YAML registry.",
    href: "https://github.com/wallbit-workflows",
    stack: ["Go", "TypeScript"],
    banner: "/images/projects/workflows.png",
  },
];

const homeProjectSlugs = ["orderly", "signal", "workflows"] as const;

/** Shown on the home page; full list lives at `/work`. */
export const homeProjects = homeProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => p != null);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
