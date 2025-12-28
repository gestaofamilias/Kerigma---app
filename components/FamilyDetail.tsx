
import React from 'react';
import { Family } from '../types';

interface FamilyDetailProps {
  family: Family;
  onBack: () => void;
  onEdit: (family: Family) => void;
}

const FamilyDetail: React.FC<FamilyDetailProps> = ({ family, onBack, onEdit }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Ativo': 
        return <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 uppercase tracking-tight">Membros Ativos</span>;
      case 'Pendente': 
        return <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100 uppercase tracking-tight">Requer Atenção</span>;
      default: 
        return <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-tight">Visitantes</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Voltar para Lista
        </button>
        <button 
          onClick={() => onEdit(family)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Editar Cadastro
        </button>
      </div>

      {/* Main Family Info Card */}
      <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800">
        <div className="relative h-32 bg-gradient-to-r from-blue-900 to-indigo-900">
           {/* Abstract pattern or church icon behind */}
           <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-[100px] text-white/5 pointer-events-none">diversity_1</span>
        </div>
        <div className="px-8 pb-8 -mt-12 relative">
          <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="relative">
              <div className="size-28 rounded-[2rem] overflow-hidden ring-8 ring-white dark:ring-surface-dark shadow-xl">
                <img 
                  src={family.photoUrl || `https://ui-avatars.com/api/?name=${family.name}&background=random&size=200`} 
                  className="w-full h-full object-cover" 
                  alt={family.name} 
                />
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{family.name}</h2>
                {getStatusBadge(family.status)}
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Líder: {family.leader}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Members List */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Membros da Família ({family.members.length})</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {family.members.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 flex items-center gap-4">
                      <div className="size-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-primary font-black shadow-sm border border-slate-100 dark:border-zinc-700">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none mb-1">
                          {member.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{member.role}</span>
                          {member.age && <span className="text-[10px] font-black text-primary/70 bg-primary/5 px-1.5 rounded uppercase">{member.age} anos</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Interaction History */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Histórico de Acompanhamento</h3>
                </div>
                <div className="space-y-4">
                  {family.interactions.map((inter, idx) => (
                    <div key={inter.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-zinc-800">
                      <div className="absolute left-[-4px] top-2 size-2 rounded-full bg-primary ring-4 ring-white dark:ring-surface-dark"></div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inter.date}</span>
                          <span className="text-[10px] font-bold text-primary italic">por {inter.author}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                          {inter.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Contact & Actions */}
            <div className="space-y-8">
              {/* Contact Card */}
              <section className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informações de Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-zinc-800 text-slate-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-700">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Telefone</p>
                      <a href={`tel:${family.phone}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">{family.phone || 'Não informado'}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-zinc-800 text-slate-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-700">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Endereço</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{family.address || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-white dark:bg-zinc-800 text-slate-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-700">
                      <span className="material-symbols-outlined text-[20px]">category</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Departamento</p>
                      <p className="text-sm font-bold text-primary uppercase">{family.department}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  WhatsApp
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  Rotas Maps
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetail;
