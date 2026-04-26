import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Nav } from "./Nav";
import { SearchForm } from "./SearchForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <BrandLogo />
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block lg:w-64">
            <SearchForm variant="header" />
          </div>
          <Button asChild className="hidden sm:inline-flex rounded-full px-6">
            <Link href="/newsletter">Subscribe</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden">
                <MenuIcon className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                <Nav className="flex-col items-start gap-4" />
                <div className="flex items-center gap-3">
                  <Link className="font-display text-2xl font-bold tracking-tight text-foreground transition hover:opacity-90" href="/">
                    ConexãoAI
                  </Link>
                </div>
                <div className="border-t pt-6">
                  <SearchForm variant="page" />
                </div>
                <Button asChild className="w-full">
                  <Link href="/newsletter">Subscribe</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
