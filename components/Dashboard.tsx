
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { INITIAL_ACTIVITIES } from '../constants';
import { View, Family } from '../types';

interface DashboardProps {
  onNavigate: (view: View) => void;
  families: Family[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, families }) => {
  const stats = useMemo(() => {
    const total = families.length;
    const pending = families.filter(f => f.status === 'Pendente').length;
    const active = families.filter(f => f.status === 'Ativo').length;
    
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        name: months[d.getMonth()],
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        registros: 0,
        visitas: 0
      });
    }

    families.forEach(f => {
      const parts = f.createdAt.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        last6Months.forEach(m => {
          if (m.monthIndex === month - 1 && m.year === year) {
            m.registros++;
          }
        });
      }

      f.interactions.forEach(inter => {
        const iParts = inter.date.split('/');
        if (iParts.length === 3) {
          const [iDay, iMonth, iYear] = iParts.map(Number);
          last6Months.forEach(m => {
            if (m.monthIndex === iMonth - 1 && m.year === iYear) {
              m.visitas++;
            }
          });
        }
      });
    });

    const deptMap: Record<string, number> = {};
    families.forEach(f => {
      const dept = f.department || 'Outros';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const deptData = Object.entries(deptMap).map(([name, value]) => ({ name: name.toUpperCase(), value }));

    return { total, pending, active, chartData: last6Months, deptData };
  }, [families]);

  return (
    <div className="px-4 py-6 flex flex-col gap-8">
      {/* High Fidelity Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Metric Card - Inspirado na Imagem 1 */}
        <div 
          onClick={() => onNavigate(View.FAMILY_LIST)}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 to-blue-900 p-8 shadow-2xl shadow-blue-900/40 cursor-pointer group transition-transform active:scale-95"
        >
          {/* Background Pattern/Icon */}
          <span className="material-symbols-outlined absolute -top-4 -right-4 text-[120px] text-white/10 rotate-12 pointer-events-none">
            church
          </span>
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div className="flex justify-between items-start">
              <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
                <span className="text-white text-xs font-bold tracking-wide">Visão Geral</span>
              </div>
              <span className="material-symbols-outlined text-white/60">church</span>
            </div>

            <div className="space-y-1">
              <p className="text-blue-100/80 text-lg font-medium">Total de Membros</p>
              <h3 className="text-6xl font-black text-white tracking-tighter">
                {stats.total.toLocaleString('pt-BR')}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/20">
                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                <span className="text-xs font-black">+5%</span>
              </div>
              <span className="text-blue-200/60 text-xs font-bold">vs. mês anterior</span>
            </div>
          </div>
        </div>

        {/* Action Card - Inspirado na Imagem 2 */}
        <div 
          className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 group cursor-default"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Comunidade"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-blue-800/40"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-center gap-6">
            <div className="max-w-[280px]">
              <h3 className="text-4xl font-black text-white leading-tight mb-2">Gestão de Membros</h3>
              <p className="text-blue-100/80 text-base font-medium">Acompanhe o crescimento e a jornada de cada vida na sua igreja.</p>
            </div>

            <button 
              onClick={() => onNavigate(View.NEW_FAMILY)}
              className="flex items-center gap-3 bg-white w-fit px-8 py-4 rounded-full shadow-xl shadow-black/20 hover:bg-slate-50 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-blue-900 font-black">add</span>
              <span className="text-blue-900 font-black tracking-tight">Novo Cadastro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-metrics secondary row - Adjusted to 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendentes</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stats.pending}</h4>
          </div>
          <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
             <span className="material-symbols-outlined text-2xl font-light">hourglass_empty</span>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visitas no Mês</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.chartData[stats.chartData.length - 1].visitas}
            </h4>
          </div>
          <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
             <span className="material-symbols-outlined text-2xl font-light">volunteer_activism</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Crescimento & Visitas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Histórico de engajamento nos últimos 6 meses</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
                <Bar name="Novos Cadastros" dataKey="registros" fill="#1e3b8a" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar name="Visitas/Interações" dataKey="visitas" fill="#93c5fd" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Atividades Recentes</h3>
          <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 divide-y divide-slate-50 dark:divide-zinc-800/50 overflow-hidden">
            {INITIAL_ACTIVITIES.map((act) => (
              <div key={act.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                {act.avatar ? (
                  <img src={act.avatar} className="size-11 rounded-full object-cover ring-4 ring-slate-50 dark:ring-zinc-800" alt={act.user} />
                ) : (
                  <div className="size-11 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 ring-4 ring-slate-50 dark:ring-zinc-800">
                     <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none mb-1">{act.user}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{act.action}</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
