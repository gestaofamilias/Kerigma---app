
import { Family, Activity } from './types';

export const INITIAL_FAMILIES: Family[] = [
  {
    id: '1',
    name: 'Família Silva',
    leader: 'João Silva',
    phone: '(11) 98888-7777',
    address: 'Rua das Flores, 123',
    department: 'social',
    status: 'Ativo',
    createdAt: '12/10/2023',
    photoUrl: 'https://picsum.photos/seed/silva/200',
    membersCount: 4,
    members: [
      { id: 'm1', name: 'João Silva', role: 'Pai (Líder)', age: 42 },
      { id: 'm2', name: 'Maria Silva', role: 'Mãe', age: 38 },
      { id: 'm3', name: 'Pedro Silva', role: 'Filho', age: 8 },
      { id: 'm4', name: 'Ana Silva', role: 'Filha', age: 14 }
    ],
    progressStage: 3,
    interactions: [
      { id: 'i1', date: '12/10/2023', note: 'Primeira visita realizada.', author: 'Pr. Carlos' },
      { id: 'i2', date: '15/11/2023', note: 'Concluiu o discipulado.', author: 'Maria Silva' }
    ]
  },
  {
    id: '2',
    name: 'Família Santos',
    leader: 'Maria Santos',
    phone: '(11) 97777-6666',
    address: 'Av. Brasil, 456',
    department: 'evangelismo',
    status: 'Pendente',
    createdAt: '05/09/2023',
    photoUrl: 'https://picsum.photos/seed/santos/200',
    membersCount: 3,
    members: [
      { id: 'm5', name: 'Maria Santos', role: 'Mãe (Líder)', age: 35 },
      { id: 'm6', name: 'Lucas Santos', role: 'Filho', age: 19 },
      { id: 'm7', name: 'Julia Santos', role: 'Filha', age: 22 }
    ],
    progressStage: 1,
    interactions: [
      { id: 'i3', date: '05/09/2023', note: 'Cadastro inicial após culto.', author: 'Sistema' }
    ]
  },
  {
    id: '4',
    name: 'Família Almeida',
    leader: 'Ricardo Almeida',
    phone: '(11) 95555-4444',
    address: 'Rua Principal, 99',
    department: 'jovens',
    status: 'Pendente',
    createdAt: '15/01/2024',
    membersCount: 1,
    members: [
      { id: 'm8', name: 'Ricardo Almeida', role: 'Pai (Líder)', age: 28 }
    ],
    progressStage: 0,
    interactions: []
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    user: 'Maria Silva',
    action: 'Atualizou o cadastro da família',
    time: '2m atrás',
    avatar: 'https://picsum.photos/seed/user1/100'
  },
  {
    id: 'act2',
    user: 'Pr. Carlos',
    action: 'Família Souza cadastrada',
    time: '1h atrás'
  }
];
