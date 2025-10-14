import { create } from "zustand";

export const UseSetCollection = create((set) => ({
  collections: [],
  collectionId: "",
  setCollections: (collections) => set({ collections }),
  setCollectionId: (collectionId) => set({ collectionId }),
}));
