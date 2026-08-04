/** Copy for /about — expand sections as the page takes shape. */
export const aboutPage = {
  title: "About",
  lead: "Backend engineer from Ecuador. I care about APIs, integrations, and everything behind the HTTP boundary.",
  diagramCaption:
    "How I think about the work: HTTP in, services and data out.",
  sections: [
    {
      id: "story",
      title: "Story",
      body: "Placeholder — how you got into backend, what you enjoy building, what you’re optimizing for next. A few short paragraphs work well here.",
    },
    {
      id: "now",
      title: "Now",
      body: "Placeholder — TRD, what you’re focused on day to day, and what kinds of problems you want more of.",
    },
    {
      id: "elsewhere",
      title: "Elsewhere",
      body: "Placeholder — GitHub, writing, side projects, or communities you contribute to. Link out where it helps.",
    },
  ],
} as const;

export const apiFlowMethods = ["GET", "POST", "PUT", "DELETE"] as const;

export const apiFlowTags = [
  { label: "orderly", icon: "queue" },
  { label: "wallbit-cli", icon: "folder" },
] as const;
