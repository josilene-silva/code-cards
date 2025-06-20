import {
  addDoc,
  collection,
  collectionGroup,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { db, FieldValue } from '../../config/firebase/firebaseConfig';
import { IPractice, NewPractice } from '../../interfaces/IPractice';
import { IUserWithPractices } from '../../interfaces/IUser';

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
  async getAllUsersAndTheirPractices() {
    try {
      // 1. Obter todos os usuários
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const practicesByUser: IUserWithPractices[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userPractices: IPractice[] = [];

        const userData = userDoc.data() as IUserWithPractices;

        // 2. Obter as práticas do usuário
        const practicesSubcollectionRef = collection(db, 'users', userId, 'practices');

        const q = query(practicesSubcollectionRef, orderBy('createdAt', 'desc'));

        const practicesSnapshot = await getDocs(q);

        practicesSnapshot.forEach((practiceDoc) => {
          userPractices.push({
            // id: practiceDoc.id,
            // collectionId: practiceDoc.data()?.collectionId,
            cardsAmount: practiceDoc.data()?.cardsAmount,
            // cardsAmountEasy: practiceDoc.data()?.cardsAmountEasy,
            // cardsAmountMedium: practiceDoc.data()?.cardsAmountMedium,
            // cardsAmountHard: practiceDoc.data()?.cardsAmountHard,
            // startTime: practiceDoc.data()?.startTime,
            endTime: practiceDoc.data()?.endTime,
          } as IPractice);
        });

        if (userPractices.length > 0) {
          // 3. Adicionar o usuário e suas práticas ao array
          // Verifica se o usuário tem práticas antes de adicioná-lo
          practicesByUser.push({
            id: userDoc.id,
            name: userData.name,
            photo: userData.photo,

            totalPracticeSessions: userPractices.length,
            totalCardsPracticed: userPractices.reduce((sum, p) => sum + (p.cardsAmount || 0), 0),
            lastPracticeTime:
              userPractices.length > 0
                ? userPractices
                    .map((p) => p.endTime)
                    .filter(Boolean)
                    .sort()
                    .reverse()[0] || ''
                : '',
          });
        }
      }

      practicesByUser.sort((a, b) => {
        return b.totalPracticeSessions - a.totalPracticeSessions; // Ordena do maior para o menor
      });

      // Retorna os 10 primeiros usuários com mais práticas
      return practicesByUser.slice(0, 10);
    } catch (error) {
      console.error('Erro ao buscar usuários e suas práticas:', error);
      return null;
    }
  },
};
