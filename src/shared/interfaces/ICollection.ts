import { ICard } from './ICard';
import { IPractice } from './IPractice';

export interface ICollection {
  id: string;
  name: string;
  description: string;
  category: { name: string };
  cards: ICard[];
  practices: IPractice[];
}
