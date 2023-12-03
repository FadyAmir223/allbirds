import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import { userReducer } from '@/features/auth'
import { CartInitialState, cartReducer } from '@/features/cart'
import { configureStore } from '@reduxjs/toolkit'

const cartPersistConfig: PersistConfig<CartInitialState> = {
  key: 'cart',
  storage,
  blacklist: ['isOpen'],
  stateReconciler: autoMergeLevel1,
}

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: persistReducer(cartPersistConfig, cartReducer),
  },
  middleware: [thunk],
})

export default store
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
