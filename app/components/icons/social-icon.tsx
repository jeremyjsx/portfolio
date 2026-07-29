import { GitHubIcon } from "@/app/components/icons/github-icon";
import { LinkedInIcon } from "@/app/components/icons/linkedin-icon";
import { XIcon } from "@/app/components/icons/x-icon";

const iconClass = "social-icon__svg";

const icons = {
  Twitter: { Icon: XIcon, modifier: "social-icon--twitter" },
  GitHub: { Icon: GitHubIcon, modifier: "social-icon--github" },
  LinkedIn: { Icon: LinkedInIcon, modifier: "social-icon--linkedin" },
} as const;

export function SocialIcon({ label }: { label: string }) {
  const config = icons[label as keyof typeof icons];
  if (!config) return null;

  const { Icon, modifier } = config;

  return (
    <span className={`social-icon ${modifier}`}>
      <Icon className={iconClass} />
    </span>
  );
}
