import { createAsyncThunk } from '@reduxjs/toolkit';
import { collectionService } from '../../api/firebase/collectionService';

import { practiceService } from '../../api/firebase/practiceService';
import { userCollectionService } from '../../api/firebase/userCollectionService';
import { ICard, NewCard, UpdateCard } from '../../interfaces/ICard';
import {
  CollectionWithUserPractices,
  ICollection,
  NewCollection,
  UpdateCollection,
} from '../../interfaces/ICollection';
import { NewUserCollection } from '../../interfaces/IUserCollection';
import { setSelectedPractice } from '../auth';
import {
  addCollectionOptimistic,
  removeCardOptimistic,
  setCardsError,
  setCardsInSelectedCollection,
  setCardsLoading,
  setCollections,
  setCollectionsError,
  setCollectionsLoading,
  setCollectionsWithUserPractices,
  setSelectedCollection,
  updateCardOptimistic,
  updateCollectionOptimistic,
} from '../collection/collectionSlice';
import { RootState } from '../index';
import { userService } from '../../api/firebase/userService';

const getCategoryName = (data: NewCollection | UpdateCollection, getState: RootState) => {
  const categories = getState.categories.categories;

  const category = categories.find((category) => category.id === data.categoryId);

  return category?.name;
};

// --- Thunks para Collections ---

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (newCollectionData: NewCollection, { dispatch, rejectWithValue, getState }) => {
    try {
      if (!newCollectionData.categoryName) {
        const categoryName = getCategoryName(newCollectionData, getState() as RootState);
        if (categoryName) {
          newCollectionData.categoryName = categoryName;
        }
      }

      const collectionWithTempId: ICollection = {
        id: `temp-${Date.now()}`,
        ...newCollectionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addCollectionOptimistic(collectionWithTempId));

      const createdCollection = await collectionService.createCollection(newCollectionData);
      console.log('[APP] Created Collection:', createdCollection);

      dispatch(addCollectionOptimistic(createdCollection));

      // Criar a ligação entre o usuário e a coleção
      const userId = (getState() as RootState).auth.user?.id; // Adapte para onde seu UID está

      console.log('[APP] User ID:', (getState() as RootState).auth.user);
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      const newUserCollectionData: NewUserCollection = {
        userId: userId,
        collectionId: createdCollection.id,
      };
      await userCollectionService.createUserCollection(newUserCollectionData);
      console.log('[APP] Created User Collection:', newUserCollectionData);

      return createdCollection;
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to create collection.'));
      return rejectWithValue(error.message);
    }
  },
);

// --- NOVO THUNK: Buscar Coleções de um Usuário (logado) ---

export const fetchUserSpecificCollections = createAsyncThunk(
  'collections/fetchUserSpecificCollections',
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(setCollections([])); // Limpa as coleções antes de buscar
    dispatch(setCollectionsLoading(true)); // Inicia o estado de carregamento

    try {
      const userId = (getState() as RootState).auth.user?.id; // Obtém o UID do usuário logado
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // 1. Obter as ligações UserCollection para este usuário
      const userCollectionsLinks = await userCollectionService.getUserCollectionsByUserId(userId);

      if (userCollectionsLinks.length === 0) {
        dispatch(setCollections([])); // Nenhuma coleção encontrada
        return [];
      }

      const collectionIds = userCollectionsLinks.map((link) => link.collectionId);

      // 2. Buscar os detalhes das Coleções usando os IDs
      const fetchedCollections: ICollection[] = [];
      const BATCH_SIZE = 10; // Limitação do Firestore para 'in' queries

      for (let i = 0; i < collectionIds.length; i += BATCH_SIZE) {
        const batchIds = collectionIds.slice(i, i + BATCH_SIZE);
        // collectionFirestoreService precisa de um método para buscar por lista de IDs
        const collectionsBatch = await collectionService.getCollectionsByIds(batchIds);
        fetchedCollections.push(...collectionsBatch);
      }

      dispatch(setCollections(fetchedCollections)); // Atualiza o estado com as coleções do usuário
      return fetchedCollections;
    } catch (error: any) {
      dispatch(setCollectionsError(error.message || 'Failed to fetch user-specific collections.'));
      return rejectWithValue(error.message);
    }
  },
);

// --- NOVO THUNK: Buscar Coleções do Usuário (logado) por Categoria ---

export const fetchUserSpecificCollectionsByCategoryId = createAsyncThunk(
  'collections/fetchUserSpecificCollectionsByCategoryId',
  async (categoryId: string, { dispatch, rejectWithValue, getState }) => {
    dispatch(setCollections([])); // Limpa as coleções antes de buscar
    dispatch(setCollectionsLoading(true)); // Inicia o estado de carregamento

    try {
      const userId = (getState() as RootState).auth.user?.id; // Obtém o UID do usuário logado
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // 1. Obter as ligações UserCollection para este usuário
      const userCollectionsLinks = await userCollectionService.getUserCollectionsByUserId(userId);

      console.log('[APP] Foram encontradas essas coleções no total', userCollectionsLinks.length);

      const collectionIds = userCollectionsLinks.map((link) => link.collectionId);

      // 2. Buscar os detalhes das Coleções usando os IDs
      const privateCollections: ICollection[] = [];
      const BATCH_SIZE = 10; // Limitação do Firestore para 'in' queries

      for (let i = 0; i < collectionIds.length; i += BATCH_SIZE) {
        const batchIds = collectionIds.slice(i, i + BATCH_SIZE);
        // collectionFirestoreService precisa de um método para buscar por lista de IDs
        const collectionsBatch = await collectionService.getCollectionsByIdsByCategoryId(
          batchIds,
          categoryId,
        );

        privateCollections.push(...collectionsBatch);
      }

      console.log(
        `[APP] Foram encontradas ${privateCollections.length} coleções privadas com essa categoria: ${categoryId}`,
      );

      const publicCollections =
        await collectionService.getPublicCollectionsByCategoryId(categoryId);

      console.log(
        `[APP] Foram encontradas ${publicCollections?.length} coleções públicas com essa categoria: ${categoryId}`,
      );

      if (publicCollections?.length === 0 && privateCollections.length === 0) {
        dispatch(setCollections([])); // Nenhuma coleção encontrada
        return [];
      }
      // 3. Combinar e ordenar as coleções
      console.log(
        `[APP] Total de coleções privadas: ${privateCollections.length}, públicas: ${publicCollections?.length}`,
      );
      console.log(
        `[APP] Total de coleções combinadas: ${privateCollections.length + (publicCollections?.length ?? 0)}`,
      );
      console.log('[APP] Ordenando coleções por data de criação (mais recentes primeiro)');

      const allCollections = [...privateCollections, ...(publicCollections ?? [])].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });

      dispatch(setCollections(allCollections)); // Atualiza o estado com as coleções do usuário
      return allCollections;
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to fetch user-specific collections.'));
      return rejectWithValue(error.message);
    }
  },
);

export const subscribeToCollectionsByCategory = createAsyncThunk(
  'collections/subscribeToCollectionsByCategory',
  async ({ categoryId }: { categoryId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setCollections([]));
    console.log('[APP] Subscribing to collections by category:', categoryId);

    if (!categoryId) {
      dispatch(setCollectionsError('Category ID is required.'));
      return rejectWithValue('Category ID is required.');
    }

    dispatch(setCollectionsLoading(true)); // Inicia o estado de carregamento

    return await new Promise<() => void>((resolve, reject) => {
      const unsubscribe = collectionService.listenToCollectionsByCategory(
        categoryId,
        (collections) => {
          dispatch(setCollections(collections));
          resolve(unsubscribe); // Resolve com a função de unsubscribe
        },
        (error) => {
          dispatch(setCollectionsError(error.message ?? 'Failed to subscribe to collections.'));
          reject(rejectWithValue(error.message));
        },
      );
    });
  },
);

export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async (updatedCollectionData: UpdateCollection, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setCollectionsLoading(true));

      if (updatedCollectionData.categoryId) {
        if (!updatedCollectionData.categoryName) {
          const categoryName = getCategoryName(updatedCollectionData, getState() as RootState);
          if (categoryName) {
            updatedCollectionData.categoryName = categoryName;
          }
        }
      } else {
        updatedCollectionData.categoryName = '';
      }
      // Opcional: Atualização otimista
      const currentState = (getState() as RootState).collections.collections;
      const existingCollection = currentState.find(
        (collection) => collection.id === updatedCollectionData.id,
      );

      // Criar um objeto Item completo para a atualização otimista
      const fullUpdatedCollection: ICollection = {
        ...(existingCollection ?? ({} as ICollection)), // Pega os dados existentes se houver
        ...updatedCollectionData,
        updatedAt: new Date().toISOString(), // Data de atualização para UI otimista
      } as ICollection;

      dispatch(updateCollectionOptimistic(fullUpdatedCollection));
      dispatch(setSelectedCollection(fullUpdatedCollection));

      await collectionService.updateCollection(updatedCollectionData);
      dispatch(setCollectionsLoading(false));
      // O listener tratará a sincronização final.
      return fullUpdatedCollection; // Retorna o item atualizado para fulfilled action
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to update collection.'));
      // Se houve um update otimista, você precisaria de uma ação para reverter
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (collectionId: string, { dispatch, rejectWithValue, getState }) => {
    try {
      const userId = (getState() as RootState).auth.user?.id;

      if (!userId) {
        throw new Error('User not authenticated.');
      }

      await collectionService.deleteCollection(collectionId);
      await userCollectionService.deleteUserCollectionByLink(userId, collectionId);

      dispatch(setSelectedCollection(null));
      return collectionId; // Retorna o ID da coleção deletada para fulfilled action
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to delete collection.'));
      // Se houve uma remoção otimista, você precisaria de uma ação para reverter
      return rejectWithValue(error.message);
    }
  },
);

// --- Thunks para Cards (dentro de uma coleção) ---

export const createCard = createAsyncThunk(
  'collections/createCard',
  async (
    { collectionId, newCardData }: { collectionId: string; newCardData: NewCard },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const createdCard = await collectionService.createCard(collectionId, newCardData);

      return createdCard;
    } catch (error: any) {
      dispatch(setCardsError(error.message ?? 'Failed to create card.'));
      return rejectWithValue(error.message);
    }
  },
);

export const subscribeToCardsInCollection = createAsyncThunk(
  'collections/subscribeToCardsInCollection',
  async (collectionId: string, { dispatch, rejectWithValue }): Promise<ICard | unknown> => {
    dispatch(setCardsLoading(true));
    return new Promise((resolve, reject) => {
      const unsubscribe = collectionService.listenToCardsInCollection(
        collectionId,
        (cards) => {
          dispatch(setCardsInSelectedCollection(cards));
          resolve(unsubscribe);
        },
        (error) => {
          dispatch(setCardsError(error.message ?? 'Failed to subscribe to cards.'));
          reject(rejectWithValue(error.message));
        },
      );
    });
  },
);

export const updateCard = createAsyncThunk(
  'collections/updateCard',
  async (
    { collectionId, updatedCardData }: { collectionId: string; updatedCardData: UpdateCard },
    { dispatch, rejectWithValue, getState },
  ) => {
    try {
      dispatch(setCardsLoading(true));
      await collectionService.updateCard(collectionId, updatedCardData);

      const currentState = (getState() as RootState).collections.cardsInSelectedCollection;
      const existingCard = currentState.find((card) => card.id === updatedCardData.id);
      const fullUpdatedCard: ICard = {
        ...(existingCard ?? ({} as ICard)),
        ...updatedCardData,
        collection_id: collectionId, // Garante que collection_id esteja presente
        updatedAt: new Date().toISOString(),
      } as ICard;

      dispatch(updateCardOptimistic(fullUpdatedCard));

      dispatch(setCardsLoading(false));

      return fullUpdatedCard;
    } catch (error: any) {
      dispatch(setCardsError(error.message ?? 'Failed to update card.'));
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCard = createAsyncThunk(
  'collections/deleteCard',
  async (
    { collectionId, cardId }: { collectionId: string; cardId: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setCardsLoading(true));
      await collectionService.deleteCard(collectionId, cardId);

      dispatch(removeCardOptimistic(cardId));

      dispatch(setCardsLoading(false));

      return cardId;
    } catch (error: any) {
      dispatch(setCardsError(error.message ?? 'Failed to delete card.'));
      return rejectWithValue(error.message);
    }
  },
);

// --- NOVO THUNK: Buscar Coleções com Dados de Práticas do Usuário ---
export const fetchCollectionsWithUserPractices = createAsyncThunk(
  'collections/fetchCollectionsWithUserPractices',
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(setCollectionsLoading(true)); // Usa o mesmo loading, ou crie um novo para esta operação

    try {
      const userId = (getState() as RootState).auth.user?.id;
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // 1. Obter todas as práticas do usuário
      const userPractices = await practiceService.getUserPractices(userId);

      if (userPractices.length === 0) {
        dispatch(setCollectionsWithUserPractices([])); // Nenhuma prática, então nenhuma coleção com práticas
        return [];
      }

      // 2. Extrair IDs únicos das coleções das práticas
      const uniqueCollectionIds = [
        ...new Set(userPractices.map((practice) => practice.collectionId)),
      ];

      // 3. Obter os detalhes das coleções correspondentes a esses IDs
      const fetchedCollections: ICollection[] = [];
      const BATCH_SIZE = 10;

      for (let i = 0; i < uniqueCollectionIds.length; i += BATCH_SIZE) {
        const batchIds = uniqueCollectionIds.slice(i, i + BATCH_SIZE);
        const collectionsBatch = await collectionService.getCollectionsByIds(batchIds);
        fetchedCollections.push(...collectionsBatch);
      }

      // 4. Mapear e combinar os dados: Agrupar práticas por coleção
      const collectionsMap = new Map<string, CollectionWithUserPractices>();

      // Inicializa o mapa com as coleções fetched
      fetchedCollections.forEach((col) => {
        collectionsMap.set(col.id, {
          ...col,
          userPractices: [],
          totalPracticeSessions: 0,
          totalCardsPracticed: 0,
          lastPracticeTime: undefined,
        });
      });

      // Adiciona as práticas a suas respectivas coleções e calcula os sumários
      userPractices.forEach((practice) => {
        const collectionData = collectionsMap.get(practice.collectionId);
        if (collectionData) {
          collectionData.userPractices.push(practice);
          collectionData.totalPracticeSessions++;
          collectionData.totalCardsPracticed += practice.cardsAmount;
          // Atualiza lastPracticeTime se esta prática for mais recente
          if (
            !collectionData.lastPracticeTime ||
            (practice.endTime && practice.endTime > collectionData.lastPracticeTime)
          ) {
            collectionData.lastPracticeTime = practice.endTime;
          }
        }
      });

      // Converte o mapa de volta para um array para o Redux
      const combinedCollections = Array.from(collectionsMap.values());

      // Opcional: Ordenar as próprias coleções combinadas (ex: por nome ou por lastPracticeTime)
      combinedCollections.sort((a, b) => {
        if (a.lastPracticeTime && b.lastPracticeTime) {
          return new Date(b.lastPracticeTime).getTime() - new Date(a.lastPracticeTime).getTime(); // Coleções com prática mais recente primeiro
        }
        if (a.name && b.name) {
          // Fallback para ordenar por nome se não houver tempo de última prática
          return a.name.localeCompare(b.name);
        }
        return 0;
      });

      dispatch(setSelectedPractice(null));

      dispatch(setCollectionsWithUserPractices(combinedCollections));
      return combinedCollections;
    } catch (error: any) {
      dispatch(
        setCollectionsError(error.message || 'Failed to fetch collections with user practices.'),
      );
      return rejectWithValue(error.message);
    }
  },
);
