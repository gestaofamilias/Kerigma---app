
export type Status = 'Ativo' | 'Pendente' | 'Inativo';

export type ProgressStage = 'Visita' | 'Discipulado' | 'Batismo' | 'Membro';

export interface Interaction {
  id: string;
  date: string;
  note: string;
  author: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  age?: number;
}

export interface Family {
  id: string;
  name: string;
  leader: string;
  phone: string;
  address: string;
  department: string;
  status: Status;
  createdAt: string;
  photoUrl?: string;
  membersCount: number;
  members: FamilyMember[];
  progressStage?: number; // 0: Visita, 1: Discipulado, 2: Batismo, 3: Membro
  interactions: Interaction[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  FAMILY_LIST = 'FAMILY_LIST',
  FAMILIES_IN_PROCESS = 'FAMILIES_IN_PROCESS',
  NEW_FAMILY = 'NEW_FAMILY',
  FAMILY_DETAIL = 'FAMILY_DETAIL',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}
