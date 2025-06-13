// src/api/firebase/itemFirestoreService.ts
import { db, FieldValue } from '@/src/shared/config/firebase/firebaseConfig';
import { ICard, NewCard, UpdateCard } from '../../interfaces/ICard';
import { ICollection, NewCollection, UpdateCollection } from '../../interfaces/ICollection';

const COLLECTIONS_COLLECTION = 'collections';
const collectionsRef = db.collection(COLLECTIONS_COLLECTION);

export async function createCollection(collectionData: NewCollection): Promise<ICollection> {
  try {
    const docRef = await collectionsRef.add({
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

export async function getCollection(): Promise<ICollection[]> {
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

export async function getCollectionById(id: string): Promise<ICollection | null> {
  try {
    const doc = await collectionsRef.doc(id).get();
    if (doc.exists()) {
      const data = doc.data();
      return {
        id: doc.id,
        name: data?.name,
        description: data?.description,
        cards: data?.cards,
        practices: data?.practices,
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

export function listenToCollections(
  callback: (items: ICollection[]) => void,
  onError: (error: Error) => void,
): () => void {
  const unsubscribe = collectionsRef.orderBy('createdAt', 'desc').onSnapshot(
    (snapshot) => {
      const collections: ICollection[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        collections.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
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
