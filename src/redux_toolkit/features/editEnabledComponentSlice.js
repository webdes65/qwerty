import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const editEnabledComponentSlice = createSlice({
  name: "editEnabledComponent",
  initialState,
  reducers: {
    setEditEnabledComponent: (state, action) => {
      return action.payload;
    },
  },
});

export const { setEditEnabledComponent } = editEnabledComponentSlice.actions;
export default editEnabledComponentSlice.reducer;
