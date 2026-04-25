import { FileText, Tags, Users, TrendingUp } from "lucide-react";
import ActivityHeatmap from "@/components/cms/ActivityHeatmap";

export const metadata = {
  title: "Dashboard CMS | Conexão AI",
};

export default function CmsDashboardPage() {
  const stats = [
    { label: "Posts Publicados", value: "24", icon: FileText, change: "+3 na última semana" },
    { label: "Posts em Rascunho", value: "5", icon: FileText, change: "Aguardam revisão" },
    { label: "Categorias", value: "8", icon: Tags, change: "Ativas" },
    { label: "Subscritores", value: "1,204", icon: Users, change: "+42 este mês" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <div className="text-sm text-slate-500 font-medium">Bem-vindo(a) ao Backoffice Editorial</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className="p-2 bg-slate-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ActivityHeatmap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Últimos Posts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Como Criar Agentes Autónomos em 2026</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Há 2 dias • Por Admin</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium border border-emerald-100">
                    Publicado
                  </span>
                  <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Ações Rápidas</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Escrever Novo Artigo
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Gerir Categorias
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition-colors border border-slate-200">
              Ver Subscritores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
