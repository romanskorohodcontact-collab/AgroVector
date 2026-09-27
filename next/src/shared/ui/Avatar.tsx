interface AvatarProps {
  initials: string;
  size?: "sm" | "md";
  variant?: "default" | "surface";
}

export function Avatar({
  initials,
  size = "md",
  variant = "default",
}: AvatarProps) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
  const variantClass =
    variant === "surface" ? "bg-bg-surface" : "bg-bg-subtle";
  return (
    <span
      className={`flex items-center justify-center rounded-full text-text-primary font-medium ${sizeClass} ${variantClass}`}
    >
      {initials}
    </span>
  );
}
