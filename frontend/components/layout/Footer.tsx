import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-3">
          <BrandLogo />
          <p className="text-sm leading-7 text-muted-foreground">
            Connecting ideas, building the future with practical analysis on AI, business, tools
            and systems designed for operators.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {primaryNav.map((item) => (
              <Link key={item.href} className="transition hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="transition hover:text-foreground" href="/newsletter">
              Newsletter
            </Link>
            <Link className="transition hover:text-foreground" href="/privacy">
              Privacy
            </Link>
            <Link className="transition hover:text-foreground" href="/terms">
              Terms
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Conexao AI</p>
        </div>
      </div>
    </footer>
  );
}
