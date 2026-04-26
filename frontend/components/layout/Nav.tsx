import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Nav({ className = "" }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {primaryNav.map((item) => (
        <Button key={item.href} asChild variant="ghost" className="h-auto font-bold tracking-tight text-muted-foreground hover:text-foreground">
          <Link href={item.href}>
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
