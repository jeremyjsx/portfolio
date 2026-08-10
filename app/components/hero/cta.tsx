import "./cta.css";
import { HeroBadges } from "@/app/components/hero/badges";
import { site } from "@/lib/site/site";

export function HeroCta() {
  return (
    <div className="hero-cta">
      <div className="hero-cta__actions">
        <a
          href={site.links.email}
          className="btn-primary"
        >
          Let&apos;s chat
        </a>
        <div className="hero-availability">
          <span className="hero-availability__label">{site.availability.label}</span>
          <span className="hero-availability__detail">{site.availability.detail}</span>
        </div>
      </div>

      <HeroBadges />
    </div>
  );
}
