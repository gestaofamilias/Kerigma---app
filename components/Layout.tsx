
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  title: string;
}

const KerigmaLogo = () => (
  <div className="flex items-center gap-0.5 font-black text-2xl tracking-tighter select-none">
    <div className="relative flex items-center justify-center">
      <span className="text-blue-500">K</span>
      <div className="absolute left-[3px] top-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Simplified fish icon (Ichthys) */}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 3C2 0 8 0 10 3C8 6 2 6 0 3Z" fill="white" />
          <path d="M10 3L8 1.5M10 3L8 4.5" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
    <span className="text-blue-500">EЯIGMA</span>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, title }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const navItems = [
    { id: View.DASHBOARD, label: 'Visão Geral', icon: 'home', color: 'blue' },
    { id: View.FAMILY_LIST, label: 'Famílias', icon: 'diversity_3', color: 'indigo' },
    { id: View.FAMILIES_IN_PROCESS, label: 'Em Processo', icon: 'hourglass_empty', color: 'amber' },
    { id: View.REPORTS, label: 'Relatórios', icon: 'description', color: 'rose' },
    { id: View.NEW_FAMILY, label: 'Novo Cadastro', icon: 'person_add', color: 'emerald' },
    { id: View.SETTINGS, label: 'Configurações', icon: 'settings', color: 'slate' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={toggleDrawer}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
          <div className="flex items-center justify-between p-6 pb-4">
            <KerigmaLogo />
            <button className="md:hidden text-zinc-400 hover:text-white p-1" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="px-3 py-2">
            <div className="h-px bg-zinc-800 w-full mb-4 opacity-50"></div>
          </div>
          <nav className="flex flex-col gap-1.5 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setIsDrawerOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  currentView === item.id 
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] transition-colors ${
                  currentView === item.id ? `text-blue-400` : 'group-hover:text-blue-300'
                }`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <img className="size-10 rounded-full object-cover ring-2 ring-zinc-800" src="https://picsum.photos/seed/admin/100" alt="Admin" />
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold truncate max-w-[120px]">Pr. Carlos</span>
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Administrador</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-5 py-4 shadow-sm border-b border-slate-100 dark:border-border-dark">
          <div className="flex items-center gap-4">
            <button className="md:hidden flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-slate-900 dark:text-white font-black text-xl tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-10 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all border border-slate-100 dark:border-zinc-700">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <button className="flex items-center justify-center size-10 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all relative border border-slate-100 dark:border-zinc-700">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2.5 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 bg-slate-50 dark:bg-background-dark/30 overflow-x-hidden">
          {children}
        </main>

        {/* Floating Action Button (Mobile Only) - Hidden on Dashboard and New Family */}
        {currentView !== View.NEW_FAMILY && currentView !== View.DASHBOARD && (
          <div className="fixed bottom-8 right-6 z-20 md:hidden">
            <button 
              onClick={() => setView(View.NEW_FAMILY)}
              className="bg-primary hover:bg-primary-hover text-white rounded-2xl p-4 shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center ring-2 ring-white/10"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
