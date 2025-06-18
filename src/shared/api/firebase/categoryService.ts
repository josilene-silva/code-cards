import {
  FieldPath,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { db } from '../../config/firebase/firebaseConfig';
import { ICategory } from '../../interfaces/ICategory';

const CATEGORIES_COLLECTION = 'categories';
const categoriesCollectionRef = db.collection(CATEGORIES_COLLECTION);

export const categoryService = {
  listenToCategories(
    callback: (items: ICategory[]) => void,
    onError: (error: Error) => void,
  ): () => void {
    const q = query(categoriesCollectionRef, orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categories: ICategory[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          categories.push({
            id: doc.id,
            name: data.name,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as ICategory);
        });
        console.log('Firestore categories listener:', categories.length);
        callback(categories);
      },
      (error) => {
        console.error('Firestore categories listener error:', error);
        onError(error);
      },
    );
    return unsubscribe;
  },

  async getPublicCategories(): Promise<ICategory[] | null> {
    try {
      const q = query(
        categoriesCollectionRef,
        where('isPublic', '==', true), // Filtro para coleções públicas
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data?.name,
          } as ICategory;
        });
      }
      return null;
    } catch (error) {
      console.error('Error getting public categories:', error);
      throw error;
    }
  },

  async getCategoriesByIds(ids: string[]): Promise<ICategory[]> {
    if (ids.length === 0) {
      return [];
    }
    if (ids.length > 10) {
      console.warn(
        "Firestore 'in' query limit is 10. Consider splitting calls or using Cloud Functions.",
      );
    }
    try {
      const q = query(categoriesCollectionRef, where(FieldPath.documentId(), 'in', ids));
      const snapshot = await getDocs(q);

      const categories: ICategory[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        categories.push({
          id: doc.id,
          name: data.name,
        } as ICategory);
      });

      return categories;
    } catch (error) {
      console.error('Error getting collections by IDs:', error);
      throw error;
    }
  },
};
