import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={`button ${variant}-button ${className}`.trim()} {...props} />;
}
