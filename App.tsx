
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FamilyList from './components/FamilyList';
import FamilyForm from './components/FamilyForm';
import FamilyDetail from './components/FamilyDetail';
import FamiliesInProgress from './components/FamiliesInProgress';
import Reports from './components/Reports';
import { View, Family, Interaction } from './types';
import { INITIAL_FAMILIES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [families, setFamilies] = useState<Family[]>(INITIAL_FAMILIES);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const getTitle = () => {
    switch(currentView) {
      case View.DASHBOARD: return 'Kerigma';
      case View.FAMILY_LIST: return 'Gestão de Famílias';
      case View.FAMILIES_IN_PROCESS: return 'Integração e Acompanhamento';
      case View.NEW_FAMILY: return editingFamily ? 'Editar Cadastro' : 'Nova Família';
      case View.FAMILY_DETAIL: return selectedFamily ? selectedFamily.name : 'Detalhes da Família';
      case View.REPORTS: return 'Relatórios e Métricas';
      case View.SETTINGS: return 'Configurações';
      default: return 'Kerigma';
    }
  };

  const handleNavigate = (view: View) => {
    if (view !== View.NEW_FAMILY) {
      setEditingFamily(null);
    }
    if (view !== View.FAMILY_DETAIL) {
      setSelectedFamily(null);
    }
    setCurrentView(view);
  };

  const handleSaveFamily = (familyData: Partial<Family>) => {
    const today = new Date().toLocaleDateString('pt-BR');
    
    if (editingFamily) {
      setFamilies(prev => prev.map(f => 
        f.id === editingFamily.id ? ({ ...f, ...familyData } as Family) : f
      ));
      setEditingFamily(null);
      setCurrentView(View.FAMILY_LIST);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const familyToAdd: Family = {
        id: newId,
        name: familyData.name || 'Nova Família',
        leader: familyData.leader || 'N/A',
        phone: familyData.phone || '',
        address: familyData.address || '',
        department: familyData.department || 'familia',
        status: 'Pendente',
        createdAt: today,
        membersCount: familyData.membersCount || (familyData.members?.length || 1),
        members: familyData.members || [],
        progressStage: 0,
        interactions: [
          {
            id: Date.now().toString(),
            date: today,
            note: `Cadastro inicial: Departamento ${familyData.department?.toUpperCase()}.`,
            author: 'Sistema'
          }
        ]
      };
      setFamilies(prev => [familyToAdd, ...prev]);
      setCurrentView(View.FAMILIES_IN_PROCESS);
    }
  };

  const handleDeleteFamily = (id: string) => {
    setFamilies(prev => prev.filter(f => f.id !== id));
  };

  const handleEditFamily = (family: Family) => {
    setEditingFamily(family);
    setCurrentView(View.NEW_FAMILY);
  };

  const handleViewDetail = (family: Family) => {
    setSelectedFamily(family);
    setCurrentView(View.FAMILY_DETAIL);
  };

  const updateFamilyStage = (id: string, stage: number) => {
    const today = new Date().toLocaleDateString('pt-BR');
    const stageNames = ['Visita', 'Discipulado', 'Batismo', 'Membro'];
    
    setFamilies(prev => prev.map(f => {
      if (f.id === id) {
        const isMembro = stage === 3;
        const log: Interaction = {
          id: Date.now().toString(),
          date: today,
          note: `Estágio atualizado para: ${stageNames[stage]}`,
          author: 'Sistema'
        };
        return {
          ...f,
          progressStage: stage,
          status: isMembro ? 'Ativo' : f.status,
          interactions: [log, ...f.interactions]
        };
      }
      return f;
    }));
  };

  const addInteraction = (id: string, note: string) => {
    const today = new Date().toLocaleDateString('pt-BR');
    setFamilies(prev => prev.map(f => {
      if (f.id === id) {
        const inter: Interaction = {
          id: Date.now().toString(),
          date: today,
          note,
          author: 'Pr. Carlos'
        };
        return { ...f, interactions: [inter, ...f.interactions] };
      }
      return f;
    }));
  };

  const deleteInteraction = (familyId: string, interactionId: string) => {
    setFamilies(prev => prev.map(f => {
      if (f.id === familyId) {
        return {
          ...f,
          interactions: f.interactions.filter(i => i.id !== interactionId)
        };
      }
      return f;
    }));
  };

  const renderContent = () => {
    switch(currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            onNavigate={handleNavigate} 
            families={families}
          />
        );
      case View.FAMILY_LIST:
        return (
          <FamilyList 
            families={families} 
            onEdit={handleEditFamily} 
            onDelete={handleDeleteFamily} 
            onViewDetail={handleViewDetail}
          />
        );
      case View.FAMILIES_IN_PROCESS:
        return (
          <FamiliesInProgress 
            families={families} 
            onUpdateStage={updateFamilyStage} 
            onAddInteraction={addInteraction}
            onDeleteInteraction={deleteInteraction}
          />
        );
      case View.REPORTS:
        return (
          <Reports families={families} />
        );
      case View.NEW_FAMILY:
        return (
          <FamilyForm 
            onSave={handleSaveFamily} 
            onCancel={() => handleNavigate(editingFamily ? View.FAMILY_LIST : View.DASHBOARD)} 
            initialData={editingFamily || undefined}
          />
        );
      case View.FAMILY_DETAIL:
        return selectedFamily ? (
          <FamilyDetail 
            family={selectedFamily} 
            onBack={() => handleNavigate(View.FAMILY_LIST)} 
            onEdit={handleEditFamily}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout currentView={currentView} setView={handleNavigate} title={getTitle()}>
      {renderContent()}
    </Layout>
  );
};

export default App;
