"use client";

import { useEffect, useState } from "react";
import { Plus, Tag as TagIcon, MoreHorizontal } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CmsCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function loadCategories() {
    setIsLoading(true);
    try {
      const data = await cmsFetch<{results?: Category[]} | Category[]>("/categories/");
      if ('results' in data && Array.isArray(data.results)) {
        setCategories(data.results);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cmsFetch("/categories/", {
        method: "POST",
        body: JSON.stringify({ name, slug: slug || undefined })
      });
      setName("");
      setSlug("");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar categoria");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categorias</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gira as categorias principais do seu blog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900">Adicionar Nova Categoria</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} type="text" className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-slate-600" placeholder="Auto-gerado se vazio" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Guardar Categoria
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">A carregar...</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-emerald-500" />
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-900"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
