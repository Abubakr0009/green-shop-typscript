// src/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./Counter";
import shoppingSlice from "./ShoppingSlice";

const store = configureStore({
  reducer: {
    counter: counterSlice,
    shopping: shoppingSlice,
  },
});

// ✅ RootState & AppDispatch type'larini export qilamiz
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
