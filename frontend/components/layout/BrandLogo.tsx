import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  href?: string;
  priority?: boolean;
  variant?: "full" | "mark";
};

const variants = {
  full: {
    alt: "Conexao AI",
    height: 499,
    src: "/brand/logo-full.png",
    width: 731,
    className: "h-8 w-auto",
  },
  mark: {
    alt: "Conexao AI",
    height: 297,
    src: "/brand/logo-mark.png",
    width: 403,
    className: "h-8 w-auto",
  },
} as const;

export function BrandLogo({
  className,
  href = "/",
  priority = false,
  variant = "full",
}: BrandLogoProps) {
  const logo = variants[variant];
  
  // Base sizing for a professional, consistent feel
  const containerClasses = className ?? "h-9 sm:h-10";

  return (
    <div className="flex items-center gap-3">
      <Link className={`relative inline-flex items-center w-32 sm:w-40 ${containerClasses}`} href={href}>
        <Image
          alt={logo.alt}
          src={logo.src}
          fill
          className="object-contain object-left"
          priority={priority}
          sizes="(max-width: 768px) 160px, 200px"
        />
      </Link>
      <div className="hidden shrink-0 rounded-full border border-border bg-muted/50 px-2 py-0.5 sm:block">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
          Global Edition
        </span>
      </div>
    </div>
  );
}
