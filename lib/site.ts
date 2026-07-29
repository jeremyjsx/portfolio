export const heroPaddingTop = "1.5rem";
export const heroSubpagePaddingTop = "1.25rem";

export const site = {
  name: "Jeremy",
  fullName: "Jeremy Mosquera",
  handle: "jeremyjsx",
  role: "backend engineer",
  roleLine: "I'm a backend engineer focused on APIs, cloud, and developer tooling.",
  location: "Ecuador",
  employer: "TRD",
  availability: {
    label: "Open to backend roles",
    detail: "Remote or hybrid",
  },
  heroBadges: [
    {
      id: "aws",
      label: "AWS Certified Developer",
      image: "/images/aws-logo.png",
      href: "https://www.credly.com/badges/57078caf-f56b-454f-b090-28041c038e86/public_url",
    },
    {
      id: "claude",
      label: "Claude Certified Architect",
      image: "/images/claude-logo.png",
      href: "https://www.credly.com/badges/a5f79830-26b4-4767-8135-5462b6ee10ff/public_url",
    },
  ],
  cvPath: "/Jeremy Mosquera - Curriculum.pdf",
  links: {
    github: "https://github.com/jeremyjsx",
    linkedin: "https://www.linkedin.com/in/jeremydev/",
    twitter: "https://x.com/jeremyjsx",
    portfolio: "https://jeremyportfolio.vercel.app",
  },
  getInTouch: {
    title: "Get in touch",
    line1: "Want to work on something together?",
    line2: "Just want to chat? Hit me up.",
  },
  footer: {
    headline: ["Let's build something", "worth shipping."],
    focusAreas: [
      "API design",
      "Services & integrations",
      "Event-driven systems",
      "Distributed systems",
      "Cloud architecture",
      "AI systems",
      "Observability",
      "TypeScript",
      "Python",
      "Go",
    ],
  },
} as const;

export const contactLinks = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
  { label: "CV", href: encodeURI(site.cvPath) },
] as const;

export const footerNav = [
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/Jeremy Mosquera - Curriculum.pdf", external: true },
] as const;

export const socialLinks = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
  { label: "Twitter", href: site.links.twitter },
] as const;

/** Top nav links */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
] as const;

/** Home “At a glance” stats */
export const stats = [
  { value: "3", suffix: "+", label: "Years of experience" },
  {
    value: "$340",
    suffix: "M+",
    label: "Annual transaction volume",
  },
  { value: "OS", suffix: "", label: "Contributor" },
] as const;
