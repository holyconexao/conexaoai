import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex h-5 items-center space-x-3 text-sm text-muted-foreground">
      <span>{post.author.name}</span>
      <Separator orientation="vertical" />
      <span>{formatDate(post.published_at)}</span>
      <Separator orientation="vertical" />
      <span>{post.reading_time} min read</span>
    </div>
  );
}
