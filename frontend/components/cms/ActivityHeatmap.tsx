"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Info, Loader2 } from "lucide-react";
import { cmsFetch } from "@/lib/cms-api";

interface ActivityData {
  date: string; // YYYY-MM-DD
  count: number;
}

interface ActivityHeatmapProps {
  data?: ActivityData[];
  title?: string;
  subtitle?: string;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ 
  data: initialData, 
  title = "Atividade Editorial",
  subtitle = "Frequência de publicações e revisões no último ano"
}) => {
  const [fetchedData, setFetchedData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(!initialData);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const result = await cmsFetch<ActivityData[]>("/posts/activity/");
      setFetchedData(result);
    } catch (error) {
      console.error("Failed to fetch activity data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadActivity();
    }
  }, [initialData, loadActivity]);

  // Generate display data
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    const dataToUse = initialData || fetchedData;

    if (dataToUse.length > 0) {
      dataToUse.forEach(item => map.set(item.date, item.count));
    } else if (!loading) {
      // Deterministic mock data fallback (seeded by day index)
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        // Deterministic pseudo-random based on day index
        const seed = ((i * 31 + 7) % 20);
        const count = seed >= 17 ? ((i * 13 + 5) % 3) + 1 : 0;
        map.set(dateStr, count);
      }
    }
    return map;
  }, [initialData, fetchedData, loading]);

  const weeks = useMemo(() => {
    const result = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364); // Last 365 days

    // Align to the start of the week (Sunday)
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    const currentDay = new Date(startDate);
    
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDay.toISOString().split("T")[0];
        week.push({
          date: dateStr,
          count: activityMap.get(dateStr) || 0,
          isToday: dateStr === today.toISOString().split("T")[0],
          isPast: currentDay <= today
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      result.push(week);
    }
    return result;
  }, [activityMap]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-100";
    if (count === 1) return "bg-emerald-200";
    if (count === 2) return "bg-emerald-300";
    if (count === 3) return "bg-emerald-400";
    if (count >= 4) return "bg-emerald-600";
    return "bg-slate-100";
  };

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Menos</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(v => (
                <div key={v} className={`w-3 h-3 rounded-sm ${getColor(v)}`} />
              ))}
            </div>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Mais</span>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-2 scrollbar-hide">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
              <span className="text-xs font-medium text-slate-500 tracking-wide">Sincronizando atividade...</span>
            </div>
          </div>
        )}
        <div className="inline-flex flex-col gap-2 min-w-max">
          {/* Month Labels */}
          <div className="flex ml-8 h-4">
             {/* Simple logic for month labels - can be improved */}
             <div className="flex gap-[18.5px]">
               {months.map(m => (
                 <span key={m} className="text-[10px] font-semibold text-slate-400 w-10 uppercase tracking-tighter">{m}</span>
               ))}
             </div>
          </div>

          <div className="flex gap-2">
            {/* Day Labels */}
            <div className="flex flex-col justify-between py-1 text-[9px] font-bold text-slate-300 uppercase w-6">
              <span>Seg</span>
              <span>Qua</span>
              <span>Sex</span>
            </div>

            {/* Grid */}
            <div className="flex gap-1.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.count} atividades em ${day.date}`}
                      className={`
                        w-[13px] h-[13px] rounded-[3px] transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-slate-300 hover:ring-offset-1
                        ${day.isPast ? getColor(day.count) : "bg-transparent"}
                        ${day.isToday ? "ring-1 ring-slate-400 ring-offset-1" : ""}
                      `}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
             <span className="text-xs text-slate-400 font-medium">Total Ano</span>
             <span className="text-sm font-bold text-slate-900">482 Ações</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-slate-400 font-medium">Média Semanal</span>
             <span className="text-sm font-bold text-slate-900">9.2</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-slate-400 font-medium">Streak Atual</span>
             <span className="text-sm font-bold text-emerald-600">12 Dias</span>
           </div>
        </div>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
          Ver Relatório Completo
        </button>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
