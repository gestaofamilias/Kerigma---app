
import React, { useState, useMemo } from 'react';
import { Family, Interaction } from '../types';

interface ReportsProps {
  families: Family[];
}

const Reports: React.FC<ReportsProps> = ({ families }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const reportData = useMemo(() => {
    // Filter families registered in the selected month/year
    const monthlyRegistrations = families.filter(f => {
      const parts = f.createdAt.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return (month - 1) === selectedMonth && year === selectedYear;
      }
      return false;
    });

    // Filter interactions (visits) in the selected month/year
    const monthlyVisits: { familyName: string, interaction: Interaction }[] = [];
    families.forEach(f => {
      f.interactions.forEach(inter => {
        const parts = inter.date.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          if ((month - 1) === selectedMonth && year === selectedYear) {
            monthlyVisits.push({ familyName: f.name, interaction: inter });
          }
        }
      });
    });

    return { 
      monthlyRegistrations, 
      monthlyVisits: monthlyVisits.sort((a, b) => {
        const dateA = a.interaction.date.split('/').reverse().join('');
        const dateB = b.interaction.date.split('/').reverse().join('');
        return dateB.localeCompare(dateA);
      }) 
    };
  }, [families, selectedMonth, selectedYear]);

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Relatórios Mensais</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Consolidado de atividades e novos membros.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Seletor de Mês */}
          <div className="relative group min-w-[140px]">
            <select 
              className="w-full h-11 pl-4 pr-10 bg-white dark:bg-surface-dark border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors">
              expand_more
            </span>
          </div>

          {/* Seletor de Ano */}
          <div className="relative group min-w-[100px]">
            <select 
              className="w-full h-11 pl-4 pr-10 bg-white dark:bg-surface-dark border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-border-dark flex items-center gap-5 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-light">person_add</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Cadastros no Mês</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{reportData.monthlyRegistrations.length}</h4>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-100 dark:border-border-dark flex items-center gap-5 shadow-sm transition-transform hover:scale-[1.01]">
          <div className="size-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-light">volunteer_activism</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Visitas / Interações</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{reportData.monthlyVisits.length}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration List */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/20">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">list_alt</span>
              Famílias Cadastradas
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-lg">Exportar</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {reportData.monthlyRegistrations.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white dark:bg-surface-dark text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-50 dark:border-zinc-800">
                  <tr>
                    <th className="px-5 py-3">Família</th>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                  {reportData.monthlyRegistrations.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{f.name}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{f.createdAt}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          f.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {f.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center">
                <span className="material-symbols-outlined text-slate-200 text-5xl mb-2">folder_off</span>
                <p className="text-slate-400 text-sm">Nenhum cadastro este mês.</p>
              </div>
            )}
          </div>
        </div>

        {/* Visits Timeline */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-50 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">history_edu</span>
              Relatório de Visitas
            </h3>
          </div>
          <div className="p-5 max-h-[400px] overflow-y-auto no-scrollbar flex flex-col gap-5">
            {reportData.monthlyVisits.length > 0 ? (
              reportData.monthlyVisits.map((item, idx) => (
                <div key={`${item.interaction.id}-${idx}`} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20">
                      {idx + 1}
                    </div>
                    {idx < reportData.monthlyVisits.length - 1 && <div className="w-px flex-1 bg-slate-100 dark:bg-zinc-800 my-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">{item.familyName}</h4>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                        <span className="text-[10px] font-bold">{item.interaction.date}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 mt-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "{item.interaction.note}"
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="size-1.5 rounded-full bg-primary/40"></div>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wide">Resp: {item.interaction.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center">
                <span className="material-symbols-outlined text-slate-200 text-5xl mb-2">event_busy</span>
                <p className="text-slate-400 text-sm">Nenhuma visita registrada este mês.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
