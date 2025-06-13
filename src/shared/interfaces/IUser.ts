import { IPractice } from './IPractice';

export interface IUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  practices?: IPractice[];
  createdAt?: string;
  updatedAt?: string;
}

export type NewUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUser = Partial<Omit<IUser, 'id'>> & { id: string };
