// src/api/firebase/userCollectionFirestoreService.ts
import { addDoc, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { db, FieldValue } from '../../config/firebase/firebaseConfig';
import { IUserCollection, NewUserCollection } from '../../interfaces/IUserCollection';

const USER_COLLECTIONS_COLLECTION = 'user_collections';

const userCollectionRef: FirebaseFirestoreTypes.CollectionReference = db.collection(
  USER_COLLECTIONS_COLLECTION,
);

export const userCollectionService = {
  async createUserCollection(data: NewUserCollection): Promise<IUserCollection> {
    try {
      const docRef = await addDoc(userCollectionRef, {
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const docSnapshot = await docRef.get();
      const docData = docSnapshot.data();

      return {
        id: docSnapshot.id,
        userId: docData?.userId,
        collectionId: docData?.collectionId,
        createdAt: docData?.createdAt?.toDate().toISOString(),
        updatedAt: docData?.updatedAt?.toDate().toISOString(),
      } as IUserCollection;
    } catch (error) {
      console.error('Error creating UserCollection:', error);
      throw error;
    }
  },

  async getUserCollectionsByUserId(userId: string): Promise<IUserCollection[]> {
    try {
      const snapshot = await userCollectionRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const userCollections: IUserCollection[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        userCollections.push({
          id: doc.id,
          userId: data.userId,
          collectionId: data.collectionId,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as IUserCollection);
      });
      return userCollections;
    } catch (error) {
      console.error(`Error getting UserCollections for user ${userId}:`, error);
      throw error;
    }
  },

  async deleteUserCollection(docId: string): Promise<void> {
    try {
      await userCollectionRef.doc(docId).delete();
    } catch (error) {
      console.error(`Error deleting UserCollection ${docId}:`, error);
      throw error;
    }
  },

  async deleteUserCollectionByLink(userId: string, collectionId: string): Promise<void> {
    try {
      const snapshot = await userCollectionRef
        .where('userId', '==', userId)
        .where('collectionId', '==', collectionId)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        await snapshot.docs[0].ref.delete();
      } else {
        console.warn(
          `No UserCollection link found for user ${userId} and collection ${collectionId}.`,
        );
      }
    } catch (error) {
      console.error(`Error deleting UserCollection link:`, error);
      throw error;
    }
  },

  listenToUserCollections(
    userId: string,
    callback: (userCollections: IUserCollection[]) => void,
    onError: (error: Error) => void,
  ): () => void {
    const unsubscribe = userCollectionRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const userCollections: IUserCollection[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userCollections.push({
              id: doc.id,
              userId: data.userId,
              collectionId: data.collectionId,
              createdAt: data.createdAt?.toDate().toISOString(),
              updatedAt: data.updatedAt?.toDate().toISOString(),
            } as IUserCollection);
          });
          callback(userCollections);
        },
        (error) => {
          console.error(`Firestore UserCollections listener error for user ${userId}:`, error);
          onError(error);
        },
      );
    return unsubscribe;
  },
};
