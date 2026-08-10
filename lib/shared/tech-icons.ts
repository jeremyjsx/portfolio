const TECH_ICON_OVERRIDES: Record<string, string> = {
  AWS: "/images/aws-logo.png",
  "React Native": "/images/tech/react.png",
  RabbitMQ: "/images/tech/rabbit-mq.png",
};

/** Maps a technology label to `public/images/tech/{slug}.png` */
export function getTechIconPath(name: string): string {
  const override = TECH_ICON_OVERRIDES[name];
  if (override) return override;

  const slug = name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\+/g, "plus")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `/images/tech/${slug}.png`;
}
