import { createSlice } from "@reduxjs/toolkit";

const storedItems = localStorage.getItem("registers");
const initialState = storedItems ? JSON.parse(storedItems) : [];

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action) => {
      return action.payload;
    },
  },
});

export const { setItems } = itemsSlice.actions;
export default itemsSlice.reducer;
