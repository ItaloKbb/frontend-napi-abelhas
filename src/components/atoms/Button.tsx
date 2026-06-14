import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "error";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  outline?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  outline = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const variantClass = outline ? `btn-outline btn-${variant}` : `btn-${variant}`;
  const sizeClass = size !== "md" ? `btn-${size}` : "";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading && <span className="loading loading-spinner" />}
      {children}
    </button>
  );
}
