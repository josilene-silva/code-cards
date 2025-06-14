// src/types/userCollection.ts

export interface IUserCollection {
  id: string; // docId auto-gerado pelo Firestore
  userId: string;
  collectionId: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export type NewUserCollection = Omit<IUserCollection, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserCollection = Partial<Omit<IUserCollection, 'id'>> & { id: string };
// Não há um 'update' para UserCollection, pois geralmente eles são criados e deletados.
// Se houvesse, seria algo como:
