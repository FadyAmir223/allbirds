import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  amount: number;
  isOpen: boolean;
  totalPrice: number;
  items: string[]; // TODO: product type
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
