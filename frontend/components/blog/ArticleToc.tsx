import type { ArticleHeading } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  if (!headings.length) {
    return null;
  }

  return (
    <Card className="bg-muted/50 border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          On this page
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                className={`block text-sm leading-6 text-muted-foreground transition hover:text-foreground ${
                  heading.level === "h3" ? "pl-4" : ""
                }`}
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
