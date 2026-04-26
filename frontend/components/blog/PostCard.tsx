import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group h-full overflow-hidden border-border bg-background transition duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
      <CardContent className="p-0 flex h-full flex-col">
        {post.featured_image ? (
          <Link href={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10]">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
        ) : (
          <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center border-b border-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 italic">
              Structured Intelligence
            </span>
          </div>
        )}
        
        <div className="flex flex-1 flex-col p-6 space-y-4">
          <div className="flex items-center gap-3">
            {post.category ? (
              <Link
                href={`/category/${post.category.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:opacity-80"
              >
                {post.category.name}
              </Link>
            ) : null}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {formatDate(post.published_at)}
            </span>
          </div>

          <h3 className="font-display text-2xl leading-[1.1] text-foreground tracking-tight">
            <Link href={`/blog/${post.slug}`} className="transition hover:text-primary">
              {post.title}
            </Link>
          </h3>

          <p className="line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
              {post.author.name}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {post.reading_time} min read
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
