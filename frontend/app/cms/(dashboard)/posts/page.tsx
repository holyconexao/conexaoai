"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cmsFetch } from "@/lib/cms-api";

interface CmsPost {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  category_name: string | null;
  author_name: string;
  is_featured: boolean;
  created_at: string;
}

interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CmsPost[];
}

export default function CmsPostsPage() {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await cmsFetch<PostsResponse>("/posts/");
        setPosts(data.results);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load posts.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Artigos</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gerencie todo o conteúdo publicado e em rascunho.</p>
        </div>
        <Link 
          href="/cms/posts/new"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          Escrever Artigo
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por título ou conteúdo..." 
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 bg-transparent placeholder:text-slate-400 font-medium text-slate-900"
          />
        </div>
        <div className="w-full sm:w-px h-px sm:h-6 bg-slate-200"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Artigo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                      A carregar artigos...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-rose-500 font-medium bg-rose-50/50">
                    {error}
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Nenhum artigo encontrado</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">Comece por criar o seu primeiro conteúdo.</p>
                    <Link href="/cms/posts/new" className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
                      Criar novo artigo &rarr;
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        <Link href={`/cms/posts/${post.id}`}>{post.title}</Link>
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {post.category_name || "Sem Categoria"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {post.author_name || "Desconhecido"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {!isLoading && posts.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
            <span className="text-slate-500">Mostrando {posts.length} de {posts.length} artigos</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium bg-white hover:bg-slate-50 disabled:opacity-50">Anterior</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium bg-white hover:bg-slate-50 disabled:opacity-50">Próxima</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
