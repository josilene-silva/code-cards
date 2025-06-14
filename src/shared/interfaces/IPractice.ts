export interface IPractice {
  id: string;

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
