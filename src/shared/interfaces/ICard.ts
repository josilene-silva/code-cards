export enum CardsDifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface ICard {
  id: string; // cardId
  collectionId: string; // ID da coleção pai
  front: string;
  back: string;

  difficultyLevel?: CardsDifficultyLevel;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export type NewCard = Omit<ICard, 'id' | 'createdAt' | 'updatedAt' | 'collectionId'>;

export type UpdateCard = Partial<Omit<ICard, 'id' | 'collectionId'>> & {
  id: string;
  collectionId: string;
};
