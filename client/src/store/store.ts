import { configureStore } from '@reduxjs/toolkit';

import { userReducer } from '@/features/auth';
import { cartRdcuer } from '@/features/cart';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartRdcuer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
