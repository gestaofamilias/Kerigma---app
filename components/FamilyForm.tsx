
import React, { useState } from 'react';
import { Family, FamilyMember } from '../types';

interface FamilyFormProps {
  onSave: (family: Partial<Family>) => void;
  onCancel: () => void;
  initialData?: Family;
}

const FamilyForm: React.FC<FamilyFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    leader: initialData?.leader || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    department: initialData?.department || ''
  });

  const [members, setMembers] = useState<FamilyMember[]>(initialData?.members || []);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberAge, setNewMemberAge] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      role: newMemberRole || 'Membro',
      age: newMemberAge ? parseInt(newMemberAge) : undefined
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberAge('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave({
      ...formData,
      members: members,
      membersCount: members.length || 1
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark">
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 px-5 space-y-6 no-scrollbar pb-32">
        {/* Banner */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
          <span className="material-symbols-outlined text-primary mt-0.5">
            {initialData ? 'edit_document' : 'add_moderator'}
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {initialData ? 'Editar Cadastro' : 'Novo Acompanhamento'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {initialData 
                ? 'Atualize as informações da família e clique em salvar para registrar as mudanças.' 
                : 'Ao salvar, a família entrará automaticamente na jornada de integração.'}
            </p>
          </div>
        </div>

        {/* Nome da Família */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="family_name">
            Nome da Família <span className="text-red-500">*</span>
          </label>
          <input 
            required
            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium" 
            id="family_name" 
            placeholder="Ex: Família Silva" 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Líder Familiar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="leader_name">
            Responsável / Líder
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </span>
            <input 
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium" 
              id="leader_name" 
              placeholder="Nome do responsável" 
              type="text"
              value={formData.leader}
              onChange={(e) => setFormData({...formData, leader: e.target.value})}
            />
          </div>
        </div>

        {/* Seção de Membros - Layout Otimizado para Mobile */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Composição Familiar ({members.length})
            </label>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* Input Container Responsivo */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3">
              <input 
                className="w-full h-11 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Nome Completo do Membro"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <div className="flex gap-2">
                <input 
                  className="flex-1 h-11 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Parentesco"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                />
                <input 
                  className="w-20 h-11 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center"
                  placeholder="Idade"
                  type="number"
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={handleAddMember}
                  className="shrink-0 size-11 rounded-xl bg-primary text-white hover:bg-primary-hover flex items-center justify-center transition-all shadow-lg shadow-primary/20 active:scale-95"
                  title="Adicionar membro"
                >
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </button>
              </div>
            </div>

            {/* Listagem de Membros Adicionados */}
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900/30 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                        {member.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-primary font-black uppercase tracking-wider">{member.role}</span>
                        {member.age !== undefined && (
                          <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-slate-500">{member.age} anos</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-slate-300 hover:text-rose-500 p-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))}
              {members.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 opacity-40">
                   <span className="material-symbols-outlined text-4xl mb-1">group_add</span>
                   <p className="text-xs font-medium">Nenhum membro adicionado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="phone">
            WhatsApp / Contato
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </span>
            <input 
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium" 
              id="phone" 
              placeholder="(00) 00000-0000" 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="address">
            Endereço Completo
          </label>
          <div className="relative">
             <span className="absolute left-4 top-3 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </span>
            <textarea 
              className="w-full min-h-[100px] pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium resize-none" 
              id="address" 
              placeholder="Rua, Número, Bairro, Cidade" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="department">
            Departamento de Destino
          </label>
          <div className="relative">
            <select 
              className="w-full h-12 pl-4 pr-10 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none outline-none cursor-pointer font-medium" 
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="">Selecione um Departamento</option>
              <option value="jovens">JOVENS</option>
              <option value="adolescentes">ADOLESCENTES</option>
              <option value="discipulado">DISCIPULADO</option>
              <option value="familia">FAMÍLIA</option>
              <option value="social">ASSISTÊNCIA SOCIAL</option>
              <option value="missoes">MISSÕES</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 md:relative p-4 border-t border-slate-100 dark:border-zinc-800 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm flex gap-3 z-50">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors border border-transparent"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSubmit}
          className="flex-[2] h-14 flex items-center justify-center rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-primary hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 active:scale-95"
        >
          <span className="material-symbols-outlined mr-2">
            {initialData ? 'save_as' : 'verified_user'}
          </span>
          {initialData ? 'Salvar Alterações' : 'Efetivar Cadastro'}
        </button>
      </div>
    </div>
  );
};

export default FamilyForm;
