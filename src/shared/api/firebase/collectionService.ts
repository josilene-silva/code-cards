// src/api/firebase/itemFirestoreService.ts
import { db, FieldValue } from '@/src/shared/config/firebase/firebaseConfig';
import {
  addDoc,
  FieldPath,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { ICard, NewCard, UpdateCard } from '../../interfaces/ICard';
import { ICollection, NewCollection, UpdateCollection } from '../../interfaces/ICollection';

const COLLECTIONS_COLLECTION = 'collections';
const collectionsRef = db.collection(COLLECTIONS_COLLECTION);

export async function createCollection(collectionData: NewCollection): Promise<ICollection> {
  try {
    const docRef = await addDoc(collectionsRef, {
      ...collectionData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const docSnapshot = await docRef.get();
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      name: data?.name,
      description: data?.description,
      categoryId: data?.categoryId,
      categoryName: data?.categoryName,
      createdAt: data?.createdAt?.toDate().toISOString(), // Convert to ISO string
      updatedAt: data?.updatedAt?.toDate().toISOString(), // Convert to ISO string
    } as ICollection;
  } catch (error) {
    console.error('Error creating colecao:', error);
    throw new Error('Não foi possível criar a coleção.');
  }
}

export async function getCollections(): Promise<ICollection[]> {
  try {
    const snapshot = await collectionsRef.orderBy('createdAt', 'desc').get();
    const collections: ICollection[] = [];

    snapshot.forEach((doc) => {
      // Converte Firestore Timestamps para Date objetos
      const data = doc.data();
      collections.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        isPublic: data.isPublic,
        createdAt: data.createdAt?.toDate().toISOString(), // Convert to ISO string
        updatedAt: data.updatedAt?.toDate().toISOString(), // Convert to ISO string
      } as ICollection); // Type assertion para garantir o tipo ICollection
    });

    return collections;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

export async function getCollectionsByIds(ids: string[]): Promise<ICollection[]> {
  if (ids.length === 0) {
    return [];
  }
  if (ids.length > 10) {
    console.warn(
      "Firestore 'in' query limit is 10. Consider splitting calls or using Cloud Functions.",
    );
  }
  try {
    const q = query(collectionsRef, where(FieldPath.documentId(), 'in', ids));
    const snapshot = await getDocs(q);

    const collections: ICollection[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      collections.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        categoryId: data?.categoryId,
        categoryName: data?.categoryName,
        isPublic: data?.isPublic,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      } as ICollection);
    });

    collections.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    return collections;
  } catch (error) {
    console.error('Error getting collections by IDs:', error);
    throw error;
  }
}

export async function getCollectionById(id: string): Promise<ICollection | null> {
  try {
    const doc = await collectionsRef.doc(id).get();
    if (doc.exists()) {
      const data = doc.data();
      return {
        id: doc.id,
        name: data?.name,
        description: data?.description,
        categoryId: data?.categoryId,
        categoryName: data?.categoryName,
        isPublic: data?.isPublic,
        createdAt: data?.createdAt?.toDate().toISOString(),
        updatedAt: data?.updatedAt?.toDate().toISOString(),
      } as ICollection;
    }
    return null;
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
}

export async function updateCollection(itemData: UpdateCollection): Promise<void> {
  try {
    const { id, ...dataToUpdate } = itemData;

    await collectionsRef.doc(id).update({
      ...dataToUpdate,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

export async function deleteCollection(id: string): Promise<void> {
  try {
    // Opcional: Se você quer deletar os cards junto com a coleção (recomendado)
    // Para grandes quantidades de cards, considere uma Cloud Function
    const cardsSnapshot = await collectionsRef.doc(id).collection('cards').get();
    const batch = db.batch(); // Use um batch para deleções múltiplas

    cardsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit(); // Executa as deleções dos cards

    await collectionsRef.doc(id).delete();
    console.log(`Collection ${id} and its cards deleted successfully.`);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

export function listenToCollectionsByCategory(
  categoryId: string,
  callback: (items: ICollection[]) => void,
  onError: (error: Error) => void,
): () => void {
  console.log('Listening to collections by category:', categoryId);
  const q = query(
    collectionsRef, // Sua referência à coleção
    where('isPublic', '==', true), // Filtro 1
    where('categoryId', '==', categoryId), // Filtro 2
    orderBy('createdAt', 'desc'), // Ordenação
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const collections: ICollection[] = [];

      console.log(`Received ${snapshot.size} collections for category ${categoryId}`);

      snapshot.forEach((doc) => {
        const data = doc.data();
        collections.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          categoryId: data?.categoryId,
          categoryName: data?.categoryName,
          isPublic: data?.isPublic,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as ICollection);
      });

      callback(collections);
    },
    (error) => {
      console.error('Firestore collections listener error:', error);
      onError(error);
    },
  );
  return unsubscribe;
}

// --- CRUD para Cards (Subcoleção) ---

export async function createCard(collectionId: string, cardData: NewCard): Promise<ICard> {
  try {
    const cardsSubCollectionRef = collectionsRef.doc(collectionId).collection('cards');
    const docRef = await cardsSubCollectionRef.add({
      ...cardData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const docSnapshot = await docRef.get();
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      collectionId: collectionId, // Adiciona o ID da coleção ao objeto do card
      front: data?.front,
      back: data?.back,
      createdAt: data?.createdAt?.toDate().toISOString(),
      updatedAt: data?.updatedAt?.toDate().toISOString(),
    } as ICard;
  } catch (error) {
    console.error(`Error creating card in collection ${collectionId}:`, error);
    throw error;
  }
}

export async function getCardsByCollectionId(collectionId: string): Promise<ICard[]> {
  try {
    const cardsSubCollectionRef = collectionsRef.doc(collectionId).collection('cards');

    const snapshot = await cardsSubCollectionRef.orderBy('createdAt', 'asc').get();

    const cards: ICard[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        collectionId: collectionId,
        front: data.front,
        back: data.back,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      } as ICard);
    });
    return cards;
  } catch (error) {
    console.error(`Error getting cards for collection ${collectionId}:`, error);
    throw error;
  }
}

export async function updateCard(collectionId: string, cardData: UpdateCard): Promise<void> {
  try {
    const { id, ...dataToUpdate } = cardData; // collectionId deve ser removido dos dados de update
    await collectionsRef
      .doc(collectionId)
      .collection('cards')
      .doc(id)
      .update({
        ...dataToUpdate,
        updatedAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error(`Error updating card ${cardData.id} in collection ${collectionId}:`, error);
    throw error;
  }
}

export async function deleteCard(collectionId: string, cardId: string): Promise<void> {
  try {
    await collectionsRef.doc(collectionId).collection('cards').doc(cardId).delete();
  } catch (error) {
    console.error(`Error deleting card ${cardId} from collection ${collectionId}:`, error);
    throw error;
  }
}

export function listenToCardsInCollection(
  collectionId: string,
  callback: (cards: ICard[]) => void,
  onError: (error: Error) => void,
): () => void {
  const unsubscribe = collectionsRef
    .doc(collectionId)
    .collection('cards')
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (snapshot) => {
        const cards: ICard[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          cards.push({
            id: doc.id,
            collectionId: collectionId,
            difficultyLevel: data.difficultyLevel,
            front: data.front,
            back: data.back,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString(),
          } as ICard);
        });
        callback(cards);
      },
      (error) => {
        console.error(`Firestore cards listener error for collection ${collectionId}:`, error);
        onError(error);
      },
    );
  return unsubscribe;
}
