export interface ICollection {
  id: string;
  name: string;
  description: string;
  isPublic?: boolean;

  categoryId?: string;
  categoryName?: string;

  createdAt?: string;
  updatedAt?: string;
}

// Tipo para dados de um novo item
export type NewCollection = Omit<ICollection, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCollection = Partial<Omit<ICollection, 'id'>> & { id: string };
