import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold transition-all duration-200 ease-in-out cursor-pointer inline-block text-center relative overflow-hidden rounded-full";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#5855ff] to-[#8b3dff] text-white hover:from-[#4a42e6] hover:to-[#7c2ff0] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#5855ff] disabled:hover:to-[#8b3dff] px-8 py-3.5 text-[16px]",
    secondary:
      "bg-white border border-[#E5E5E7] text-[#333] hover:bg-[#F9F9F9] disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3.5 text-[16px]",
    ghost: "text-[#5855ff] hover:underline px-4 py-2 text-[14px] bg-transparent",
  };

  const style =
    variant === "primary"
      ? { boxShadow: "inset 0 0 10px #fff, 0 8px 24px rgba(88, 85, 255, 0.4)" }
      : undefined;

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button className={classes} style={style} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
