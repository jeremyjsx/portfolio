export type ProjectSiteIcon = "external" | "cli" | "registry";

export type ProjectSite = {
  label: string;
  href: string;
  icon?: ProjectSiteIcon;
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  /** GitHub repo or org */
  href?: string;
  /** Live demos / deployed pages */
  sites?: ProjectSite[];
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
      "FastAPI e-commerce backend with RBAC, RabbitMQ payments, Redis caching, and WebSocket order tracking.",
    href: "https://github.com/jeremyjsx/orderly",
    stack: ["Python", "FastAPI"],
    banner: "/images/projects/orderly.png",
  },
  {
    slug: "entries",
    name: "entries",
    emoji: "🐈‍⬛",
    category: "Backend / Content",
    description:
      "Go content API: Markdown in S3, metadata in Postgres, draft/publish, and inline image uploads.",
    href: "https://github.com/jeremyjsx/entries",
    stack: ["Go"],
    banner: "/images/projects/entries.png",
  },
  {
    slug: "signal",
    name: "signal",
    emoji: "🛰️",
    category: "Backend / AI pipeline",
    description:
      "RSS intelligence pipeline with AI scoring, feed health, and local Obsidian sync for curated engineering reading.",
    href: "https://github.com/jeremyjsx/signal",
    sites: [{ label: "Live", href: "https://signal-kappa-gold.vercel.app" }],
    stack: ["Python", "FastAPI"],
    banner: "/images/projects/signal.png",
  },
  {
    slug: "workflows",
    name: "workflows",
    emoji: "🌀",
    category: "Open source / Dev tooling",
    description:
      "Open-source Wallbit toolchain: CLI, workflow registry, and Go SDK for programmable financial flows.",
    href: "https://github.com/wallbit-workflows",
    sites: [
      {
        label: "CLI",
        href: "https://wallbit-cli.vercel.app/",
        icon: "cli",
      },
      {
        label: "Registry",
        href: "https://wallbit-registry.vercel.app/",
        icon: "registry",
      },
    ],
    stack: ["Go", "TypeScript"],
    banner: "/images/projects/workflows.png",
  },
];

const homeProjectSlugs = ["orderly", "signal", "workflows"] as const;

/** Shown on the home page; full list lives at `/projects`. */
export const homeProjects = homeProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => p != null);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
