export interface IPractice {
  id: string;

  userId?: string; // ID do usuário

  collectionId: string;
  collectionName: string;

  cardsAmount: number;

  cardsAmountEasy: number;
  cardsAmountMedium: number;
  cardsAmountHard: number;

  startTime: string;
  endTime: string;

  createdAt?: string;
  updatedAt?: string;
}

export type NewPractice = Omit<IPractice, 'id' | 'createdAt' | 'updatedAt'>;
