type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  outline?: boolean;
  className?: string;
}

export function Badge({
  label,
  variant = "primary",
  outline = false,
  className = "",
}: BadgeProps) {
  const variantClass = outline
    ? `badge-outline badge-${variant}`
    : `badge-${variant}`;

  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>{label}</span>
  );
}
