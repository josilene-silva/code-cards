import { addDoc } from '@react-native-firebase/firestore';
import { db, FieldValue } from '../../config/firebase/firebaseConfig';

import { IUser, NewUser, UpdateUser } from '../../interfaces/IUser';

const USERS_COLLECTION = 'users';
const userRef = db.collection(USERS_COLLECTION);

export const userService = {
  async createUser(userData: NewUser): Promise<any> {
    try {
      const docRef = await addDoc(userRef, {
        ...userData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const docSnapshot = await docRef.get();
      const data = docSnapshot.data();

      return {
        id: docSnapshot.id,
        name: data?.name,
        email: data?.email,
        createdAt: data?.createdAt?.toDate().toISOString(), // Convert to ISO string
        updatedAt: data?.updatedAt?.toDate().toISOString(), // Convert to ISO string
      } as IUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Não foi possível criar o usuário.');
    }
  },
  async updateUser(itemData: UpdateUser): Promise<void> {
    try {
      const { id, ...dataToUpdate } = itemData;
      await userRef.doc(id).update({
        ...dataToUpdate,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const querySnapshot = await userRef.where('email', '==', email).get();
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as IUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },
};
