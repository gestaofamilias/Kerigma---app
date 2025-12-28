
import React from 'react';
import { Family } from '../types';

interface FamiliesInProgressProps {
  families: Family[];
  onUpdateStage: (familyId: string, newStage: number) => void;
  onAddInteraction: (familyId: string, note: string) => void;
  onDeleteInteraction: (familyId: string, interactionId: string) => void;
}

const STAGES = ['Visita', 'Discipulado', 'Batismo', 'Membro'];

const FamiliesInProgress: React.FC<FamiliesInProgressProps> = ({ families, onUpdateStage, onAddInteraction, onDeleteInteraction }) => {
  const pendingFamilies = families.filter(f => f.status === 'Pendente');
  const [showInteractionInput, setShowInteractionInput] = React.useState<string | null>(null);
  const [note, setNote] = React.useState('');

  const handleSaveInteraction = (familyId: string) => {
    if (note.trim()) {
      onAddInteraction(familyId, note);
      setNote('');
      setShowInteractionInput(null);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acompanhamento de Integração</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie o progresso e as interações de cada família até a membresia.</p>
      </div>

      <div className="flex flex-col gap-6">
        {pendingFamilies.length === 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-12 text-center border border-dashed border-slate-200 dark:border-border-dark">
            <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">handshake</span>
            <p className="text-slate-500">Nenhuma família aguardando integração.</p>
          </div>
        ) : (
          pendingFamilies.map((family) => {
            const currentStage = family.progressStage ?? 0;
            return (
              <div key={family.id} className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-border-dark overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-2xl bg-primary/5 dark:bg-primary/20 text-primary flex items-center justify-center font-black text-xl border border-primary/10">
                        {family.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{family.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">Líder: {family.leader} • Depto: <span className="uppercase text-primary/80">{family.department}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowInteractionInput(showInteractionInput === family.id ? null : family.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Nova Interação
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="relative pt-4 pb-10 px-4">
                    <div className="absolute top-8 left-8 right-8 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full z-0"></div>
                    <div 
                      className="absolute top-8 left-8 h-1.5 bg-primary rounded-full z-0 transition-all duration-700 ease-out"
                      style={{ width: `${(currentStage / (STAGES.length - 1)) * 100 - (currentStage === 0 ? 0 : 2)}%` }}
                    ></div>

                    <div className="flex justify-between relative z-10">
                      {STAGES.map((label, index) => {
                        const isCompleted = index <= currentStage;
                        const isCurrent = index === currentStage;
                        
                        return (
                          <div key={label} className="flex flex-col items-center gap-3">
                            <button
                              onClick={() => onUpdateStage(family.id, index)}
                              className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                                isCompleted 
                                  ? 'bg-primary text-white border-primary scale-110 shadow-lg shadow-primary/20' 
                                  : 'bg-white dark:bg-zinc-800 text-slate-400 border-slate-100 dark:border-zinc-700'
                              } ${isCurrent ? 'ring-4 ring-primary/20 ring-offset-2 dark:ring-offset-zinc-900' : ''}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {index === 3 ? 'verified' : isCompleted ? 'done_all' : 'hourglass_top'}
                              </span>
                            </button>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-primary' : 'text-slate-400'}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interaction Input */}
                  {showInteractionInput === family.id && (
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2">
                      <textarea 
                        autoFocus
                        placeholder="Descreva a visita, conversa ou observação..." 
                        className="w-full p-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none mb-3"
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowInteractionInput(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveInteraction(family.id)} className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-md shadow-primary/10">Registrar</button>
                      </div>
                    </div>
                  )}

                  {/* Interaction History */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-zinc-800 pb-1">Histórico Recente</p>
                    <div className="max-h-48 overflow-y-auto pr-2 no-scrollbar space-y-3">
                      {family.interactions.length > 0 ? (
                        family.interactions.map((inter) => (
                          <div key={inter.id} className="group flex gap-3 items-start p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <div className="size-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                  <span className="font-bold text-slate-900 dark:text-white">{inter.date}:</span> {inter.note}
                                </p>
                                <button 
                                  onClick={() => onDeleteInteraction(family.id, inter.id)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                                  title="Excluir interaçao"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400 italic">Por {inter.author}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic py-2">Nenhuma interação registrada ainda.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-900/50 px-6 py-4 flex justify-between items-center border-t border-slate-100 dark:border-border-dark">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span className="text-[11px] font-medium">Cadastrado em {family.createdAt}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (currentStage < STAGES.length - 1) {
                        onUpdateStage(family.id, currentStage + 1);
                      }
                    }}
                    className="flex items-center gap-2 text-xs font-black text-white bg-primary px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    disabled={currentStage === STAGES.length - 1}
                  >
                    <span>PRÓXIMO PASSO</span>
                    <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FamiliesInProgress;
