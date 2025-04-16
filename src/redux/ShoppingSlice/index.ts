// src/redux/ShoppingSlice/index.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getter, setter, deletter } from "../../hooks/useLocalStorage";

interface ShoppingItem {
  _id: string;
  name: string;
  price: number;
  count: number;
  [key: string]: any; // qo‘shimcha fieldlar bo‘lishi mumkin
}

interface Coupon {
  has_coupon: boolean;
  discount_for: number;
}

interface ShoppingState {
  data: ShoppingItem[];
  coupon: Coupon;
  total: number;
  track_order?: string | number;
}

const _calcTotal = (data: ShoppingItem[]): number => {
  return data.reduce(
    (acc, currentValue) => currentValue?.count * currentValue?.price + acc,
    0
  );
};

const initialState: ShoppingState = {
  data: (getter({ key: "shopping_card" }) as ShoppingItem[]) ?? [],
  coupon: {
    has_coupon: false,
    discount_for: 0,
  },
  total: (getter({ key: "total_price" }) as number) ?? 0,
};

const shoppingSlice = createSlice({
  name: "shoppingSlice",
  initialState,
  reducers: {
    addDataToShopping(state, action: PayloadAction<ShoppingItem>) {
      const payload = action.payload;
      const exists = state.data.some((value) => value._id === payload._id);

      state.data = exists
        ? state.data.map((value) =>
            value._id === payload._id
              ? { ...payload, count: value.count + 1 }
              : value
          )
        : [...state.data, { ...payload, count: 1 }];

      state.total = _calcTotal(state.data);
      setter({ key: "shopping_card", setValue: state.data });
      setter({ key: "total_price", setValue: state.total });
    },

    increaseCountFromShopping(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;

      state.data = state.data.map((value) =>
        value._id === _id
          ? { ...value, count: Number(value.count) + 1 }
          : value
      );

      state.total = _calcTotal(state.data);
      setter({ key: "shopping_card", setValue: state.data });
      setter({ key: "total_price", setValue: state.total });
    },

    decreaseCountFromShopping(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;

      state.data = state.data.map((value) =>
        value._id === _id
          ? {
              ...value,
              count: Number(value.count) ? Number(value.count) - 1 : 1,
            }
          : value
      );

      state.total = _calcTotal(state.data);
      setter({ key: "shopping_card", setValue: state.data });
      setter({ key: "total_price", setValue: state.total });
    },

    deleteFlowerFromShopping(state, action: PayloadAction<{ _id: string }>) {
      const { _id } = action.payload;

      state.data = state.data.filter((value) => value._id !== _id);
      state.total = _calcTotal(state.data);
      setter({ key: "shopping_card", setValue: state.data });
      setter({ key: "total_price", setValue: state.total });
    },

    makeEverythingZero(state) {
      state.data = [];
      state.coupon = {
        has_coupon: false,
        discount_for: 0,
      };
      state.total = 0;
      deletter({ key: "shopping_card" });
      deletter({ key: "total_price" });
    },

    setTrackOrder(state, action: PayloadAction<string | number>) {
      state.track_order = action.payload;
    },
  },
});

export const {
  addDataToShopping,
  increaseCountFromShopping,
  decreaseCountFromShopping,
  deleteFlowerFromShopping,
  makeEverythingZero,
  setTrackOrder,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
