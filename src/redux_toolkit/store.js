import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./features/itemsSlice";
import dragDisabledReducer from "./features/dragDisabledSlice";
import componentsReducer from "./features/componentsSlice";
import showBtnDeleteComponentReducer from "./features/showBtnDeleteComponentSlice";
import editEnabledComponentReducer from "./features/editEnabledComponentSlice";
import realtimeServiceSliceReducer from "./features/realtimeServiceSlice";

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
