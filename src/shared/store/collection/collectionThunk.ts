import { createAsyncThunk } from '@reduxjs/toolkit';
import * as CollectionService from '../../api/firebase/collectionService';

import { ICard, NewCard, UpdateCard } from '../../interfaces/ICard';
import { ICollection, NewCollection, UpdateCollection } from '../../interfaces/ICollection';
import {
  addCardOptimistic,
  addCollectionOptimistic,
  removeCardOptimistic,
  removeCollectionOptimistic,
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
  async (newCollectionData: NewCollection, { dispatch, rejectWithValue }) => {
    try {
      // Opcional: Gerar um ID temporário para a coleção otimista
      const tempId = `temp-${Date.now()}`;
      const collectionWithTempId: ICollection = {
        id: tempId,
        ...newCollectionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCollectionOptimistic(collectionWithTempId)); // Atualização otimista da UI

      const createdCollection = await CollectionService.createCollection(newCollectionData);
      // Aqui você precisaria de uma lógica para remover a coleção otimista e adicionar a real
      // Ou, mais simples, você pode depender do listener para atualizar a lista completa
      // Se não usar otimismo, basta esperar a criação e o listener irá adicionar.
      // Para este exemplo, o listener fará a sincronização final.
      dispatch(removeCollectionOptimistic(tempId));

      return createdCollection;
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to create collection.'));
      // Se houve um update otimista, você precisaria de uma ação para reverter
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Thunk para obter todos os itens (usando listener em tempo real).
 * Este thunk não retorna uma Promise simples, ele configura um listener.
 * A gestão do loading e erros será feita pelo listener que dispara `setItems` e `setItemsError`.
 */
export const subscribeToCollections = createAsyncThunk<() => void, void>(
  'collections/subscribeToCollections',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setCollectionsLoading(true));

    return await new Promise<() => void>((resolve, reject) => {
      const unsubscribe = CollectionService.listenToCollections(
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

      await CollectionService.updateCollection(updatedCollectionData);
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
  async (collectionId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(removeCollectionOptimistic(collectionId)); // Remoção otimista da UI
      await CollectionService.deleteCollection(collectionId);

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

      const createdCard = await CollectionService.createCard(collectionId, newCardData);
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
      const unsubscribe = CollectionService.listenToCardsInCollection(
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

      await CollectionService.updateCard(collectionId, updatedCardData);
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
      await CollectionService.deleteCard(collectionId, cardId);
      return cardId;
    } catch (error: any) {
      dispatch(setCardsError(error.message ?? 'Failed to delete card.'));
      return rejectWithValue(error.message);
    }
  },
);
