import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const componentsSlice = createSlice({
  name: "components",
  initialState,
  reducers: {
    setComponents: (state, action) => {
      return action.payload;
    },
  },
});

export const { setComponents } = componentsSlice.actions;
export default componentsSlice.reducer;