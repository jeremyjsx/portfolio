import Image from "next/image";
import { site } from "@/lib/site/site";

function BadgeContent({ badge }: { badge: (typeof site.heroBadges)[number] }) {
  return (
    <>
      <span className="hero-badge__icon" aria-hidden>
        <Image
          src={badge.image}
          alt=""
          width={18}
          height={18}
          className="hero-badge__img"
        />
      </span>
      <span className="hero-badge__label">{badge.label}</span>
    </>
  );
}

export function HeroBadges() {
  return (
    <ul className="hero-badges m-0 list-none p-0">
      {site.heroBadges.map((badge) => {
        const href =
          "href" in badge && typeof badge.href === "string" ? badge.href : undefined;

        return (
          <li key={badge.id}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-badge"
              >
                <BadgeContent badge={badge} />
              </a>
            ) : (
              <span className="hero-badge">
                <BadgeContent badge={badge} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
