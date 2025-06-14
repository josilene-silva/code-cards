import { addDoc, getDocs, onSnapshot, orderBy, query } from '@react-native-firebase/firestore';
import { db, FieldValue } from '../../config/firebase/firebaseConfig';
import { IPractice, NewPractice } from '../../interfaces/IPractice';

const PRACTICES_COLLECTION_NAME = 'practices';
const USERS_COLLECTION_NAME = 'users';

export const practiceService = {
  getUserPracticesCollectionRef(userId: string) {
    return db.collection(USERS_COLLECTION_NAME).doc(userId).collection(PRACTICES_COLLECTION_NAME);
  },

  async createPractice(userId: string, practiceData: NewPractice): Promise<IPractice> {
    try {
      const practicesRef = this.getUserPracticesCollectionRef(userId);

      const docRef = await addDoc(practicesRef, {
        ...practiceData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const docSnapshot = await docRef.get();
      const docData = docSnapshot.data();

      return {
        id: docSnapshot.id,
        collectionId: docData?.collectionId,
        collectionName: docData?.collectionName ?? '',

        cardsAmount: practiceData.cardsAmount,
        cardsAmountEasy: practiceData.cardsAmountEasy,
        cardsAmountMedium: practiceData.cardsAmountMedium,
        cardsAmountHard: practiceData.cardsAmountHard,

        startTime: docData?.startTime ?? '',
        endTime: docData?.endTime ?? '',

        createdAt: docData?.createdAt?.toDate().toISOString(),
        updatedAt: docData?.updatedAt?.toDate().toISOString(),
      } as IPractice;
    } catch (error) {
      console.error('Error creating Practice:', error);
      throw error;
    }
  },
  async getUserPractices(userId: string): Promise<IPractice[]> {
    try {
      const practicesRef = this.getUserPracticesCollectionRef(userId);
      // Opcional: ordenar as práticas, por exemplo, pela data de início
      const q = query(practicesRef, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);

      const practices: IPractice[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        practices.push({
          id: doc.id,
          collectionId: data?.collectionId,
          cardsAmount: data?.cardsAmount,
          cardsAmountEasy: data?.cardsAmountEasy,
          cardsAmountMedium: data?.cardsAmountMedium,
          cardsAmountHard: data?.cardsAmountHard,
          startTime: data?.startTime,
          endTime: data?.endTime,
          createdAt: data?.createdAt?.toDate().toISOString(),
          updatedAt: data?.updatedAt?.toDate().toISOString(),
        } as IPractice);
      });
      return practices;
    } catch (error) {
      console.error(`Error getting user practices for ${userId}:`, error);
      throw error;
    }
  },
  listenToUserPractices(
    userId: string,
    callback: (practices: IPractice[]) => void,
    onError: (error: Error) => void,
  ): () => void {
    const practicesRef = this.getUserPracticesCollectionRef(userId);
    const q = query(practicesRef, orderBy('start_time', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const practices: IPractice[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          practices.push({
            id: doc.id,
            collectionId: data?.collectionId,
            cardsAmount: data?.cardsAmount,
            cardsAmountEasy: data?.cardsAmountEasy,
            cardsAmountMedium: data?.cardsAmountMedium,
            cardsAmountHard: data?.cardsAmountHard,
            startTime: data?.startTime,
            endTime: data?.endTime,
            createdAt: data?.createdAt?.toDate().toISOString(),
            updatedAt: data?.updatedAt?.toDate().toISOString(),
          } as IPractice);
        });
        callback(practices);
      },
      (error) => {
        console.error(`Firestore user practices listener error for ${userId}:`, error);
        onError(error);
      },
    );
    return unsubscribe;
  },
};
