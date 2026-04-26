import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <Card className="group relative overflow-hidden border-none bg-transparent shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground italic">
              Clear, dense, structured intelligence.
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-background/80 text-foreground backdrop-blur-sm border-none shadow-sm">
              Featured
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {post.category ? (
              <Link
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:opacity-80"
                href={`/category/${post.category.slug}`}
              >
                {post.category.name}
              </Link>
            ) : null}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
              •
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {post.reading_time} min read
            </span>
          </div>

          <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            <Link className="transition hover:text-primary" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          
          <p className="text-base leading-8 text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} />
                ) : (
                  <span className="text-[10px] font-bold">{post.author.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground leading-none">{post.author.name}</span>
                <span className="text-[10px] text-muted-foreground mt-1">{formatDate(post.published_at)}</span>
              </div>
            </div>
            
            <Link
              href={`/blog/${post.slug}`}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary hover:text-primary"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
