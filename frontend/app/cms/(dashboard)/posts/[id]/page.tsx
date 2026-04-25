"use client";

import { useEffect, useState } from "react";
import PostForm from "@/components/cms/PostForm";
import { cmsFetch } from "@/lib/cms-api";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await cmsFetch(`/posts/${params.id}/`);
        setPost(data);
      } catch (error) {
        console.error("Failed to load post", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) {
      loadPost();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return <PostForm initialData={post} postId={params.id as string} />;
}
