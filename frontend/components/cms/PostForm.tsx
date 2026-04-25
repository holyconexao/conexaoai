"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Image as ImageIcon, Settings, Tag, Globe, ArrowLeft, Loader2, FileText, Eye, Edit3, AlertCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cmsFetch } from "@/lib/cms-api";

// Validation Schema
const postSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(200),
  slug: z.string().optional().or(z.literal("")),
  excerpt: z.string().max(500, "O resumo não deve exceder 500 caracteres").optional().or(z.literal("")),
  content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  status: z.enum(["draft", "published"]),
  category: z.string().optional().or(z.literal("")),
  author: z.string().min(1, "O autor é obrigatório"),
  meta_title: z.string().max(70, "O meta título não deve exceder 70 caracteres").optional().or(z.literal("")),
  meta_description: z.string().max(160, "A meta descrição não deve exceder 160 caracteres").optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional().or(z.literal("")),
});

type PostFormValues = z.infer<typeof postSchema>;

interface Category { id: number; name: string; }
interface Author { id: number; user: { username: string }; }

interface PostFormProps {
  initialData?: any;
  postId?: string;
}

export default function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      status: initialData?.status || "draft",
      category: initialData?.category ? String(initialData.category) : "",
      author: initialData?.author ? String(initialData.author) : "",
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
      is_featured: initialData?.is_featured || false,
      published_at: initialData?.published_at || "",
    },
  });

  const content = watch("content");
  const status = watch("status");

  useEffect(() => {
    async function loadFormMetadata() {
      try {
        const [catRes, authRes] = await Promise.all([
          cmsFetch<{results?: Category[]} | Category[]>("/categories/"),
          cmsFetch<{results?: Author[]} | Author[]>("/authors/")
        ]);
        setCategories('results' in catRes && Array.isArray(catRes.results) ? catRes.results : (Array.isArray(catRes) ? catRes : []));
        setAuthors('results' in authRes && Array.isArray(authRes.results) ? authRes.results : (Array.isArray(authRes) ? authRes : []));
      } catch (error) {
        console.error("Failed to load metadata", error);
      }
    }
    loadFormMetadata();
  }, []);

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    
    const payload = {
      ...data,
      slug: data.slug || undefined,
      category: data.category ? parseInt(data.category) : null,
      author: data.author ? parseInt(data.author) : null,
      published_at: data.published_at || null,
    };

    try {
      if (postId) {
        await cmsFetch(`/posts/${postId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await cmsFetch(`/posts/`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/cms/posts");
      router.refresh();
    } catch (error) {
      alert("Erro ao guardar o post. Verifique os dados.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/cms/posts" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {postId ? "Editar Artigo" : "Criar Novo Artigo"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            {...register("status")}
            className="text-sm font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="draft">Rascunho</option>
            <option value="review">Em Revisão</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Agendado</option>
          </select>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <FileText className="w-5 h-5 text-emerald-600" />
              Conteúdo Principal
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título do Artigo</label>
                <input 
                  type="text" 
                  {...register("title")}
                  className={`w-full text-lg px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.title ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  placeholder="Ex: Como a IA está a revolucionar a produtividade..."
                />
                {errors.title && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <input 
                  type="text" 
                  {...register("slug")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-slate-600"
                  placeholder="Deixar em branco para auto-gerar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo (Excerpt)</label>
                <textarea 
                  rows={3}
                  {...register("excerpt")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Breve resumo do artigo"
                />
                {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt.message}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Corpo do Artigo (Markdown)</label>
                  <button 
                    type="button" 
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    {isPreview ? <><Edit3 className="w-3.5 h-3.5" /> Editar</> : <><Eye className="w-3.5 h-3.5" /> Preview</>}
                  </button>
                </div>
                {isPreview ? (
                  <div className="w-full h-[360px] overflow-y-auto px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 prose prose-sm sm:prose-base max-w-none prose-emerald">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*Nenhum conteúdo escrito ainda.*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea 
                    rows={16}
                    {...register("content")}
                    className={`w-full text-sm px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono ${errors.content ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    placeholder="Escreva o conteúdo em Markdown..."
                  />
                )}
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Globe className="w-5 h-5 text-emerald-600" />
              SEO & Metadados
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                <input 
                  type="text" 
                  {...register("meta_title")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                <textarea 
                  rows={2}
                  {...register("meta_description")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Tag className="w-5 h-5 text-emerald-600" />
              Estrutura
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  {...register("category")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
                <select 
                  {...register("author")}
                  className={`w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.author ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <option value="">Selecionar autor...</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.user.username}</option>
                  ))}
                </select>
                {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-lg">
              <Settings className="w-5 h-5 text-emerald-600" />
              Publicação
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="featured"
                  {...register("is_featured")}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-slate-700 font-medium">Destacar na Home</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Publicação</label>
                <input 
                  type="datetime-local" 
                  {...register("published_at")}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Obrigatório para estados "Publicado" ou "Agendado".</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">Imagem Destacada</h3>
            <p className="text-xs text-slate-500 mt-1">Gestão Cloudinary na V2.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
