import { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost";
  icon?: ReactNode;
};

export function Button({
  className = "",
  children,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-orange text-charcoal shadow-pill hover:bg-orange-dark hover:text-ivory",
    ghost:
      "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory",
  };

  return (
    <button
      className={`inline-flex items-center gap-3 rounded-pill px-7 py-3 text-base font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}

