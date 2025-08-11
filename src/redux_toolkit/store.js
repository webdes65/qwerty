import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "@redux_toolkit/features/itemsSlice";
import dragDisabledReducer from "@redux_toolkit/features/dragDisabledSlice";
import componentsReducer from "@redux_toolkit/features/componentsSlice";
import showBtnDeleteComponentReducer from "@redux_toolkit/features/showBtnDeleteComponentSlice";
import editEnabledComponentReducer from "@redux_toolkit/features/editEnabledComponentSlice";
import realtimeServiceSliceReducer from "@redux_toolkit/features/realtimeServiceSlice";

const store = configureStore({
  reducer: {
    items: itemsReducer,
    dragDisabled: dragDisabledReducer,
    components: componentsReducer,
    showBtnDeleteComponent: showBtnDeleteComponentReducer,
    editEnabledComponent: editEnabledComponentReducer,
    realtimeService: realtimeServiceSliceReducer,
  },
});

export default store;
