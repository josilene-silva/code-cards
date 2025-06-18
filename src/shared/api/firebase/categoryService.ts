import { onSnapshot, orderBy, query } from '@react-native-firebase/firestore';
import { db } from '../../config/firebase/firebaseConfig';
import { ICategory } from '../../interfaces/ICategory';

const CATEGORIES_COLLECTION = 'categories';
const categoriesCollectionRef = db.collection(CATEGORIES_COLLECTION);

export const categoryService = {
  listenToCategories(
    callback: (items: ICategory[]) => void,
    onError: (error: Error) => void,
  ): () => void {
    const unsubscribe = categoriesCollectionRef.onSnapshot(
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
};
