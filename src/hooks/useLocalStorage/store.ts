// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../useLocalStorage/AuthSlice'; // yoki boshqa slice
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;  // RootState tipi
export type AppDispatch = typeof store.dispatch;  // AppDispatch tipi
// custom hooklar
export const useAppDispatch = () => useDispatch<AppDispatch>(); // dispatchni to'g'ri type qilish
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // selectorni to'g'ri type qilish
