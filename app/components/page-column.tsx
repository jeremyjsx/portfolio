import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { heroPaddingTop, heroSubpagePaddingTop } from "@/lib/site/site";

type PageColumnVariant = "hero" | "section" | "section-tight";

const variantClass: Record<PageColumnVariant, string> = {
  hero: "page-column-hero",
  section: "page-column-block",
  "section-tight": "page-column-block-tight",
};

function heroColumnStyle(
  variant: PageColumnVariant,
  className: string,
): CSSProperties | undefined {
  if (variant !== "hero") {
    return undefined;
  }

  const paddingTop = className.includes("page-column-hero--subpage")
    ? heroSubpagePaddingTop
    : heroPaddingTop;

  return { paddingTop };
}

export function PageColumn({
  children,
  variant = "section",
  ruleTop = false,
  className = "",
  style,
  ...props
}: {
  children: ReactNode;
  variant?: PageColumnVariant;
  /** Full-width dashed line above this block */
  ruleTop?: boolean;
  className?: string;
} & ComponentPropsWithoutRef<"div">) {
  const columnStyle = heroColumnStyle(variant, className);

  return (
    <>
      {ruleTop ? <div className="section-rule" aria-hidden /> : null}
      <div
        className={`page-column ${variantClass[variant]} ${className}`.trim()}
        style={{ ...columnStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
