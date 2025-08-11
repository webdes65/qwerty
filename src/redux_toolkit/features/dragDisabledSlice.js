import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const dragDisabledSlice = createSlice({
  name: "dragDisabled",
  initialState,
  reducers: {
    setDragDisabled: (state, action) => {
      return action.payload;
    },
  },
});

export const { setDragDisabled } = dragDisabledSlice.actions;
export default dragDisabledSlice.reducer;
