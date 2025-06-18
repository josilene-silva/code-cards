import { IPractice } from './IPractice';

export interface IUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  photo?: string;
  practices?: IPractice[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserWithPractices extends Pick<IUser, 'id' | 'name' | 'photo'> {
  totalPracticeSessions: number; // Total number of practice sessions
  totalCardsPracticed: number; // Total number of cards practiced
  lastPracticeTime?: string; // Date of the last practice
}

export type NewUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUser = Partial<Omit<IUser, 'id'>> & { id: string };
