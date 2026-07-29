import { getTechIconPath } from "@/lib/tech-icons";

type ExperienceTechChipProps = {
  name: string;
  showIcon: boolean;
};

export function ExperienceTechChip({ name, showIcon }: ExperienceTechChipProps) {
  const iconSrc = getTechIconPath(name);

  return (
    <li className="experience-timeline__tech-chip">
      {showIcon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc}
          alt=""
          width={16}
          height={16}
          decoding="async"
          className="experience-timeline__tech-icon"
        />
      ) : null}
      <span>{name}</span>
    </li>
  );
}
