/** Copy for /about. */
export const aboutPage = {
  title: "About",
  lead:
    "Backend engineer from Ecuador. Three years building APIs, cloud systems, and developer tooling.",
  sections: [
    {
      id: "story",
      title: "Story",
      paragraphs: [
        "I fell in love with coding at 15. It started as recreation: small sites in HTML, CSS, and JavaScript, mostly a way to sharpen creativity rather than a career plan. At the same time I was chasing AI, reading and tinkering, trying to understand how the pieces fit.",
        "Then I hit a wall that still shapes how I work. Repositories and services were not enough. I wanted something visual that people could actually use, not just clone. That pulled me into frontend, then deeper into backend once I cared about the systems behind the screen.",
        "I started working as a software engineer at 18. Since then I have focused on Python, JavaScript, and Go, with FastAPI, Express, NestJS, and Gin, and on AWS, microservices, and serverless architectures. At TRD I help build high-performance APIs and backend systems for interactive ordering platforms used across multiple countries, supporting 500K+ monthly users and more than $340M in annual revenue.",
      ],
    },
    {
      id: "now",
      title: "Now",
      paragraphs: [
        "I am a Backend Engineer at TRD, shipping services and products for high-traffic platforms across Latin America. Day to day that means API design, integrations, cloud infrastructure, and the reliability work that keeps kiosks and payments moving.",
        "I still care about the full path from idea to something people can touch. Side projects like orderly, signal, entries, and wallbit-workflows are where I explore the same problems with sharper ownership: clear contracts, honest failure modes, and tools other engineers can run.",
      ],
    },
    {
      id: "elsewhere",
      title: "Elsewhere",
      paragraphs: [
        "I write about backend fundamentals when something finally clicked for me in production. Public work lives on GitHub under jeremyjsx, including open-source tooling for Wallbit and personal systems I keep shipping.",
      ],
    },
  ],
} as const;
