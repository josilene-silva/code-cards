import { IPractice } from './IPractice';

export type CollectionLevels = 'basic' | 'intermediate' | 'advanced';

export interface ICollection {
  id: string;
  name: string;
  description: string;
  isPublic?: boolean;

  level?: CollectionLevels;

  categoryId?: string;
  categoryName?: string;

  createdAt?: string;
  updatedAt?: string;
}

// Novo tipo para exibir na listagem
export interface CollectionWithUserPractices extends ICollection {
  userPractices: IPractice[]; // Lista de práticas que o usuário realizou para esta coleção
  totalPracticeSessions: number; // Quantidade de sessões de prática para esta coleção
  totalCardsPracticed: number; // Soma de cardsAmount de todas as práticas
  lastPracticeTime?: string; // Data da última prática
}

// Tipo para dados de um novo item
export type NewCollection = Omit<ICollection, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCollection = Partial<Omit<ICollection, 'id'>> & { id: string };
