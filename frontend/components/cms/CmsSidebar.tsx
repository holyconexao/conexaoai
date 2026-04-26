import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  Users, 
  Mail, 
  Image as ImageIcon, 
  Settings,
  LogOut
} from "lucide-react";
import { BrandLogo } from "../layout/BrandLogo";

export default function CmsSidebar() {
  const navItems = [
    { name: "Dashboard", href: "/cms", icon: LayoutDashboard },
    { name: "Posts", href: "/cms/posts", icon: FileText },
    { name: "Categorias", href: "/cms/categories", icon: Tags },
    { name: "Tags", href: "/cms/tags", icon: Tags },
    { name: "Autores", href: "/cms/authors", icon: Users },
    { name: "Newsletter", href: "/cms/newsletter", icon: Mail },
    { name: "Media", href: "/cms/media", icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <BrandLogo className="h-6 w-24 brightness-0 invert" />
        <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">CMS</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors group text-sm font-medium"
          >
            <item.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link 
          href="/cms/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors group text-sm font-medium"
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-white" />
          Configurações
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-rose-500/10 hover:text-rose-400 transition-colors group text-sm font-medium text-slate-400">
          <LogOut className="w-4 h-4" />
          Terminar Sessão
        </button>
      </div>
    </aside>
  );
}
