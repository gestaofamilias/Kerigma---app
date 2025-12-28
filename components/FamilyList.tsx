
import React, { useState } from 'react';
import { Family, Status } from '../types';

interface FamilyListProps {
  families: Family[];
  onEdit: (family: Family) => void;
  onDelete: (familyId: string) => void;
  onViewDetail: (family: Family) => void;
}

const FamilyList: React.FC<FamilyListProps> = ({ families, onEdit, onDelete, onViewDetail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredFamilies = families.filter(f => {
    return f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           f.leader.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getProgressInfo = (stage: number = 0) => {
    const percentage = Math.round((stage / 3) * 100);
    const label = stage === 3 ? 'Jornada de Discipulado' : 'Integração';
    return { percentage, label };
  };

  const getStatusBadge = (status: Status) => {
    switch(status) {
      case 'Ativo': 
        return <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 uppercase tracking-tight">Membros Ativos</span>;
      case 'Pendente': 
        return <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100 uppercase tracking-tight">Requer Atenção</span>;
      default: 
        return <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-tight">Visitantes</span>;
    }
  };

  const getStatusColor = (status: Status) => {
    if (status === 'Ativo') return 'bg-green-500';
    if (status === 'Pendente') return 'bg-orange-500';
    return 'bg-blue-500';
  };

  // Lógica de segmentação por idade
  const renderAgeTags = (family: Family) => {
    const members = family.members || [];
    
    const hasKids = members.some(m => m.age !== undefined && m.age >= 4 && m.age < 12);
    const hasAdolescentes = members.some(m => m.age !== undefined && m.age >= 12 && m.age < 18);
    const hasJovens = members.some(m => m.age !== undefined && m.age >= 18 && (m.role?.toLowerCase().includes('filh') || m.role?.toLowerCase().includes('jovem')));

    return (
      <div className="flex gap-2 flex-wrap">
        {hasKids && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-tighter border border-blue-100/50 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">mood</span>
            Kids
          </span>
        )}
        {hasAdolescentes && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-tighter border border-orange-100/50 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">sentiment_satisfied</span>
            Adolescentes
          </span>
        )}
        {hasJovens && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-black uppercase tracking-tighter border border-purple-100/50 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Jovens
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Search Header */}
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-surface-dark rounded-full px-5 py-4 shadow-sm border border-slate-100 dark:border-zinc-800">
          <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nome, endereço..." 
            className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-white placeholder:text-slate-400 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Header */}
      <div className="flex justify-between items-center px-1">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          TOTAL: {filteredFamilies.length} FAMÍLIAS
        </h4>
        <button className="flex items-center gap-1 text-[11px] font-black text-primary uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">sort</span>
          Ordenar
        </button>
      </div>

      {/* Family Cards List */}
      <div className="flex flex-col gap-5 pb-20">
        {filteredFamilies.map((family) => {
          const { percentage, label } = getProgressInfo(family.progressStage);
          
          return (
            <div 
              key={family.id} 
              className="bg-white dark:bg-surface-dark rounded-[2rem] p-6 shadow-sm border border-slate-50 dark:border-zinc-800 transition-all hover:shadow-md group relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex gap-4 items-start mb-6">
                <div 
                  className="relative shrink-0 cursor-pointer"
                  onClick={() => onViewDetail(family)}
                >
                  <div className="size-16 rounded-full overflow-hidden ring-4 ring-slate-50 dark:ring-zinc-900 shadow-inner hover:scale-105 transition-transform">
                    <img 
                      src={family.photoUrl || `https://ui-avatars.com/api/?name=${family.name}&background=random&size=128`} 
                      className="w-full h-full object-cover" 
                      alt={family.name} 
                    />
                  </div>
                  <div className={`absolute bottom-0 right-0 size-4 rounded-full border-2 border-white dark:border-zinc-900 ${getStatusColor(family.status)} shadow-sm`}></div>
                </div>

                <div className="flex flex-col flex-1 min-w-0 pt-1">
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => onViewDetail(family)}>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-primary transition-colors">{family.name}</h3>
                      <p className="text-xs text-slate-400 font-medium truncate mb-2">{family.address || 'Sem endereço cadastrado'}</p>
                      {getStatusBadge(family.status)}
                    </div>
                    
                    <div className="flex gap-1">
                       <button onClick={(e) => { e.stopPropagation(); onEdit(family); }} className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                       <button onClick={(e) => { e.stopPropagation(); setDeletingId(family.id); }} className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="bg-slate-50/50 dark:bg-zinc-900/40 rounded-2xl p-4 mb-6 cursor-pointer" onClick={() => onViewDetail(family)}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
                  <span className="text-[11px] font-black text-primary">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${family.status === 'Pendente' ? 'bg-orange-400' : 'bg-primary'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="h-px bg-slate-50 dark:bg-zinc-800 w-full mb-5"></div>

              {/* Card Footer Actions - Icons removed per request */}
              <div className="flex items-center">
                {/* Segment Tags only */}
                {renderAgeTags(family)}
              </div>
            </div>
          );
        })}
        
        {filteredFamilies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl mb-2">search_off</span>
            <p className="font-bold">Nenhuma família encontrada</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] w-full max-w-xs overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-zinc-800">
            <div className="p-8 text-center">
              <div className="size-20 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
                <span className="material-symbols-outlined text-4xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Excluir Família?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Esta ação removerá permanentemente todo o histórico desta vida.</p>
            </div>
            <div className="flex border-t border-slate-50 dark:border-zinc-800">
              <button 
                onClick={() => setDeletingId(null)}
                className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  onDelete(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 py-5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border-l border-slate-50 dark:border-zinc-800"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyList;
