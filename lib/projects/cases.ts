import fs from "node:fs";
import path from "node:path";

const projectsDirectory = path.join(process.cwd(), "content", "projects");

export function getProjectCaseStudy(slug: string): string | undefined {
  const filePath = path.join(projectsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
}
