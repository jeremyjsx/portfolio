import { ArrowLeft, ArrowRight } from "lucide-react";

type ArrowIconProps = {
  direction?: "left" | "right";
  className?: string;
};

/** Lucide arrow for link-arrow / nav chrome. */
export function ArrowIcon({
  direction = "right",
  className = "",
}: ArrowIconProps) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <Icon
      className={`link-arrow__icon ${className}`.trim()}
      size={14}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
