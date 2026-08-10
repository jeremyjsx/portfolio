import type { ReactNode } from "react";
import { ArrowIcon } from "@/app/components/icons/arrow-icon";

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string; external?: boolean };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
      <h2 className="type-section-title m-0">{title}</h2>
      {action ? (
        <a
          href={action.href}
          target={action.external === false ? undefined : "_blank"}
          rel={action.external === false ? undefined : "noopener noreferrer"}
          className="link-arrow shrink-0"
        >
          {action.label}
          <ArrowIcon />
        </a>
      ) : null}
    </div>
  );
}

export function SectionIntro({ children }: { children: ReactNode }) {
  return <p className="type-body mb-8 max-w-[390px]">{children}</p>;
}
