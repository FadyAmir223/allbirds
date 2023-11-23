import { createSlice } from '@reduxjs/toolkit';

import { Cart } from '../types/cart.type';

type InitialState = {
  amount: number;
  isOpen: boolean;
  totalPrice: number;
  items: Cart[];
};

const initialState: InitialState = {
  amount: 0,
  isOpen: false,
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggle } = cartSlice.actions;
export const cartRdcuer = cartSlice.reducer;
