export type ExperienceEntry = {
  id: string;
  image?: string;
  emoji?: string;
  title: string;
  company: string;
  period: string;
  description: string;
  activities: string[];
  technologies: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "trd",
    image: "/images/TRD.png",
    title: "Backend Engineer",
    company: "TRD",
    period: "June 2023 — Present",
    description:
      "Building APIs, event-driven services, and observability tooling for high-traffic ordering and kiosk platforms across Latin America—plus web and mobile interfaces in React, Next.js, and React Native when the product needs a tight loop with the backend. Work spans log ingestion and real-time analytics, payment integrations, serverless processing pipelines, delivery routing microservices, and resilient rate limiting under concurrent load, with emphasis on service boundaries, conventional commits, and code review.",
    activities: [
      "Centralized logging and monitoring backend for a large kiosk fleet (FastAPI, PostgreSQL, AWS Lambda, API Gateway).",
      "Payment integrations and transaction services for a high-volume ordering platform.",
      "Serverless processing pipelines for media ingestion and analysis (Go, Lambda, S3, Step Functions).",
      "Delivery routing and geolocation microservices (Python, FastAPI, Redis).",
      "API rate limiting with burst handling, monitoring, and alerting (FastAPI, Redis, PostgreSQL).",
      "Web and admin UIs in Next.js and React from design handoff through production.",
      "Mobile features in React Native and Expo for ordering and operations workflows.",
      "Internal training platform for engineering teams using RAG over technical sources.",
    ],
    technologies: [
      "Python",
      "Go",
      "TypeScript",
      "FastAPI",
      "NestJS",
      "Express",
      "React",
      "Next.js",
      "PostgreSQL",
      "Redis",
      "AWS Lambda",
      "API Gateway",
      "S3",
      "Step Functions",
      "SQS",
      "Cognito",
      "Docker",
      "GitHub Actions",
    ],
  },
  {
    id: "personal",
    emoji: "✌️",
    title: "Personal projects & open source",
    company: "github.com/jeremyjsx",
    period: "September 2019 — Present",
    description:
      "Started coding in 2019 and moved from classroom basics to shipping real software on GitHub. Early on I learned the hard way that huge repos stall—now I focus on smaller, complete backends and tools I can actually maintain, with React or Next.js frontends when a project needs a usable surface. My public work spans e-commerce APIs, content systems, AI pipelines, and workflow tooling, with most projects open under @jeremyjsx.",
    activities: [
      "50+ public repositories exploring backends in Python, Go, and TypeScript.",
      "Built orderly, entries, signal, and Wallbit Workflows—APIs, pipelines, CLIs, and UIs shipped end to end.",
      "Contributed to LATAM developer communities and shared learnings through open source.",
      "Iterating in public: conventional commits, READMEs, and repos meant to be forked or reused.",
    ],
    technologies: [
      "Python",
      "Go",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "AWS",
      "React",
      "Next.js",
      "Git",
      "GitHub",
    ],
  },
];
