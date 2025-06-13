// src/redux/slices/collectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../../interfaces/ICard';
import { ICollection } from '../../interfaces/ICollection';

interface CollectionState {
  collections: ICollection[];
  loadingCollections: boolean;
  errorCollections: string | null;

  selectedCollection: ICollection | null;
  cardsInSelectedCollection: ICard[];

  loadingCards: boolean;
  errorCards: string | null;
}

const initialState: CollectionState = {
  collections: [],
  loadingCollections: false,
  errorCollections: null,

  selectedCollection: null,
  cardsInSelectedCollection: [],

  loadingCards: false,
  errorCards: null,
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    // Collections
    setCollectionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingCollections = action.payload;
      state.errorCollections = null;
    },
    setCollections: (state, action: PayloadAction<ICollection[]>) => {
      state.collections = action.payload;
      state.loadingCollections = false;
      state.errorCollections = null;
    },
    setCollectionsError: (state, action: PayloadAction<string | null>) => {
      state.errorCollections = action.payload;
      state.loadingCollections = false;
    },
    addCollectionOptimistic: (state, action: PayloadAction<ICollection>) => {
      state.collections.unshift(action.payload);
    },
    removeCollectionOptimistic: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter((col) => col.id !== action.payload);
    },
    updateCollectionOptimistic: (state, action: PayloadAction<ICollection>) => {
      const index = state.collections.findIndex((col) => col.id === action.payload.id);
      if (index !== -1) {
        state.collections[index] = action.payload;
      }
    },

    // Cards
    setSelectedCollection: (state, action: PayloadAction<ICollection | null>) => {
      state.selectedCollection = action.payload;
      state.cardsInSelectedCollection = []; // Limpa cards ao mudar a coleção
      state.loadingCards = false;
      state.errorCards = null;
    },
    setCardsLoading: (state, action: PayloadAction<boolean>) => {
      state.loadingCards = action.payload;
      state.errorCards = null;
    },
    setCardsInSelectedCollection: (state, action: PayloadAction<ICard[]>) => {
      state.cardsInSelectedCollection = action.payload;
      state.loadingCards = false;
      state.errorCards = null;
    },
    setCardsError: (state, action: PayloadAction<string | null>) => {
      state.errorCards = action.payload;
      state.loadingCards = false;
    },
    addCardOptimistic: (state, action: PayloadAction<ICard>) => {
      if (state.selectedCollection && action.payload.collectionId === state.selectedCollection.id) {
        state.cardsInSelectedCollection.unshift(action.payload);
      }
    },
    removeCardOptimistic: (state, action: PayloadAction<string>) => {
      state.cardsInSelectedCollection = state.cardsInSelectedCollection.filter(
        (card) => card.id !== action.payload,
      );
    },
    updateCardOptimistic: (state, action: PayloadAction<ICard>) => {
      const index = state.cardsInSelectedCollection.findIndex(
        (card) => card.id === action.payload.id,
      );
      if (index !== -1) {
        state.cardsInSelectedCollection[index] = action.payload;
      }
    },
  },
});

export const {
  setCollectionsLoading,
  setCollections,
  setCollectionsError,
  addCollectionOptimistic,
  removeCollectionOptimistic,
  updateCollectionOptimistic,
  setSelectedCollection,
  setCardsLoading,
  setCardsInSelectedCollection,
  setCardsError,
  addCardOptimistic,
  removeCardOptimistic,
  updateCardOptimistic,
} = collectionSlice.actions;

export default collectionSlice.reducer;
