import { createAsyncThunk } from '@reduxjs/toolkit';
import * as collectionService from '../../api/firebase/collectionService';

import { userCollectionService } from '../../api/firebase/userCollectionService';
import { ICard, NewCard, UpdateCard } from '../../interfaces/ICard';
import { ICollection, NewCollection, UpdateCollection } from '../../interfaces/ICollection';
import { NewUserCollection } from '../../interfaces/IUserCollection';
import {
  addCardOptimistic,
  addCollectionOptimistic,
  removeCardOptimistic,
  setCardsError,
  setCardsInSelectedCollection,
  setCardsLoading,
  setCollections,
  setCollectionsError,
  setCollectionsLoading,
  setSelectedCollection,
  updateCardOptimistic,
  updateCollectionOptimistic,
} from '../collection/collectionSlice';
import { RootState } from '../index';

// --- Thunks para Collections ---

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (newCollectionData: NewCollection, { dispatch, rejectWithValue, getState }) => {
    try {
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

export const subscribeToCollectionsByCategory = createAsyncThunk<
  () => void,
  { categoryId: string }
>(
  'collections/subscribeToCollectionsByCategory',
  async ({ categoryId }: { categoryId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setCollections([])); // Limpa as coleções antes de iniciar a assinatura
    // Inicia o estado de carregamento
    console.log('[APP] Subscribing to collections by category:', categoryId);
    // Retorna uma função de unsubscribe para permitir que o componente cancele a assinatura
    if (!categoryId) {
      dispatch(setCollectionsError('Category ID is required.'));
      return rejectWithValue('Category ID is required.');
    }
    // Retorna uma Promise que resolve com a função de unsubscribe
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

      await collectionService.updateCollection(updatedCollectionData);
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
      const tempId = `temp-card-${Date.now()}`;
      const cardWithTempId: ICard = {
        id: tempId,
        collectionId: collectionId,
        ...newCardData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCardOptimistic(cardWithTempId));

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
      const currentState = (getState() as RootState).collections.cardsInSelectedCollection;
      const existingCard = currentState.find((card) => card.id === updatedCardData.id);
      const fullUpdatedCard: ICard = {
        ...(existingCard ?? ({} as ICard)),
        ...updatedCardData,
        collection_id: collectionId, // Garante que collection_id esteja presente
        updatedAt: new Date().toISOString(),
      } as ICard;
      dispatch(updateCardOptimistic(fullUpdatedCard));

      await collectionService.updateCard(collectionId, updatedCardData);
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
      dispatch(removeCardOptimistic(cardId));
      await collectionService.deleteCard(collectionId, cardId);
      return cardId;
    } catch (error: any) {
      dispatch(setCardsError(error.message ?? 'Failed to delete card.'));
      return rejectWithValue(error.message);
    }
  },
);

// --- Thunks para UserCollections

export const addUserCollection = createAsyncThunk(
  'userCollections/addUserCollection',
  async (collectionId: string, { dispatch, rejectWithValue, getState }) => {
    try {
      const userId = (getState() as RootState).auth.user?.id; // Adapte para onde seu UID está
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      const newUserCollectionData: NewUserCollection = {
        userId: userId,
        collectionId: collectionId,
      };
      const createdLink = await userCollectionService.createUserCollection(newUserCollectionData);
      // Opcional: dispatch uma action para adicionar a ligação ao estado Redux,
      // ou apenas confie no listener se você tiver um.
      return createdLink;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add user collection.');
    }
  },
);

export const removeUserCollection = createAsyncThunk(
  'userCollections/removeUserCollection',
  async (collectionId: string, { dispatch, rejectWithValue, getState }) => {
    try {
      const userId = (getState() as RootState).auth.user?.uid; // Adapte para onde seu UID está
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      // Use o método que remove pelo link (user_id e collection_id)
      await userCollectionService.deleteUserCollectionByLink(userId, collectionId);
      // Opcional: dispatch uma action para remover a ligação do estado Redux
      return collectionId; // Retorna o ID da coleção removida
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove user collection.');
    }
  },
);

// E um thunk para ouvir as coleções do usuário, se necessário
export const subscribeToUserCollections = createAsyncThunk<() => void, void>(
  'userCollections/subscribeToUserCollections',
  async (_, { dispatch, rejectWithValue, getState }) => {
    const userId = (getState() as RootState).auth.user?.uid;
    if (!userId) {
      return rejectWithValue('User not authenticated.');
    }

    // dispatch(setUserCollectionsLoading(true)); // Se você tiver um loading state
    return new Promise<() => void>((resolve, reject) => {
      const unsubscribe = userCollectionService.listenToUserCollections(
        userId,
        (userCollections) => {
          // dispatch(setUserCollections(userCollections)); // Dispatch para seu slice
          resolve(unsubscribe);
        },
        (error) => {
          // dispatch(setUserCollectionsError(error.message)); // Dispatch de erro
          reject(rejectWithValue(error.message));
        },
      );
    });
  },
);

// --- NOVO THUNK: Buscar Coleções de um Usuário ---

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
