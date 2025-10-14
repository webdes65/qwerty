import { create } from "zustand";

export const UseSetCollection = create((set) => ({
  collections: [],
  collection: "",
  setCollections: (collections) => set({ collections }),
  setCollection: (collection) => set({ collection }),
}));
