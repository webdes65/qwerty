import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const realtimeServiceSlice = createSlice({
  name: "realtimeService",
  initialState,
  reducers: {
    setRealtimeService: (state, action) => {
      return action.payload;
    },
  },
});

export const { setRealtimeService } = realtimeServiceSlice.actions;
export default realtimeServiceSlice.reducer;
