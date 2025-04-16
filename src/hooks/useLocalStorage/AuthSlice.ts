// src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  // Qo'shimcha foydalanuvchi ma'lumotlari, masalan:
  // avatar: string;
}

interface AuthState {
  user: User | null;
  isLogged: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogged: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLogged = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLogged = false;
    },
    // Foydalanuvchi ma'lumotlarini yangilash uchun qo'shimcha reducer
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateUser } = authSlice.actions;

export default authSlice.reducer;

