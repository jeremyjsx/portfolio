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
    period: "June 2023 - Present",
    description:
      "Building scalable backend services, AI-powered applications, and web and mobile products for high-traffic platforms used across Latin America. Delivering software end-to-end, from service design and backend architecture to cloud infrastructure, third-party integrations, and user-facing applications using Go, Python, TypeScript, Next.js, React, and React Native.",
    activities: [
      "Building products for a platform powering 2,000+ self-ordering kiosks across Ecuador, Colombia, Chile, Argentina, Brazil, and Venezuela, supporting approximately $340M in annual transactions.",
      "Developed a centralized logging platform serving 2,000+ kiosks, improving operational visibility and reducing incident response time by 40%.",
      "Built an AI-powered application that processes classroom recordings through a serverless pipeline, orchestrating transcription, insight generation, notifications, and AI-driven recommendations using AWS Step Functions and cloud-native services.",
      "Designed and implemented scalable backend APIs supporting real-time communication between kiosks, cloud services, and third-party integrations.",
      "Developed and integrated payment solutions for self-ordering kiosks across multiple payment providers, including Deuna, Redeban, Clover, RutPay, MachPay, and Cashea.",
      "Implemented authentication, authorization, and secure API integrations across cloud-native applications and third-party services.",
      "Built an AI-powered code review platform that analyzes pull requests and entire repositories through distributed batch processing with Claude, automatically identifying bugs, architectural issues, and code quality improvements.",
      "Optimized backend services for reliability and high-concurrency workloads through asynchronous processing, caching, and resilient service design.",
      "Designed internal APIs and operational tooling to streamline engineering workflows and improve developer productivity.",
      "Delivered production-ready web and mobile applications using React, Next.js, and React Native."
    ],
    technologies: [
      "Go",
      "TypeScript",
      "NestJS",
      "Python",
      "FastAPI",
      "React",
      "Next.js",
      "React Native",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
      "GitHub Actions",
    ],
  },
  {
    id: "personal",
    image: "/squared-logo.png",
    title: "Open Source & Personal Projects",
    company: "github.com/jeremyjsx",
    period: "September 2019 - Present",
    description:
      "Building open-source software to explore backend engineering, distributed systems, and AI. My projects range from production APIs and cloud-native services to developer tools, workflow automation, and modern web applications, all designed to solve real engineering problems.",
    activities: [
      "Built Orderly, a FastAPI e-commerce backend with RBAC, RabbitMQ payment workers, Redis caching, and WebSocket order tracking.",
      "Built Signal, an RSS intelligence pipeline with LLM scoring, feed health, and local Obsidian sync for curated engineering reading.",
      "Built Entries, a Go content API with Markdown in S3, metadata in Postgres, draft/publish, and inline image extraction.",
      "Built Wallbit Workflows: Go CLI, YAML workflow contract, public registry, and Go SDK for composing Wallbit API operations.",
      "Contributed to Petdex with batch pet installation for full collections and macOS app menu navigation improvements.",
      "Contributed to open-source in the LATAM developer ecosystem (including Wallbit tooling and Crafter Station).",
      "Maintain docs, tests, and CI on the projects I keep public and link from this site.",
    ],
    technologies: [
      "Python",
      "Go",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "AWS",
      "React",
      "Next.js",
      "Git",
      "GitHub",
    ],
  },
];
