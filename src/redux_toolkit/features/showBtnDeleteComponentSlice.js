import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const showBtnDeleteComponentSlice = createSlice({
  name: "setShowBtnDeleteComponent",
  initialState,
  reducers: {
    setShowBtnDeleteComponent: (state, action) => {
      return action.payload;
    },
  },
});

export const { setShowBtnDeleteComponent } =
  showBtnDeleteComponentSlice.actions;
export default showBtnDeleteComponentSlice.reducer;
