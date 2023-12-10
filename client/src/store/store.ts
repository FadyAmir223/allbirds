import { configureStore } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { UserInitialState, userReducer } from '@/features/auth'
import { CartInitialState, cartReducer } from '@/features/cart'

const cartPersistConfig: PersistConfig<CartInitialState> = {
  key: 'cart',
  storage,
  blacklist: ['isOpen'],
  stateReconciler: autoMergeLevel1,
}

const userPersistConfig: PersistConfig<UserInitialState> = {
  key: 'user',
  storage,
}

const store = configureStore({
  reducer: {
    user: persistReducer(userPersistConfig, userReducer),
    cart: persistReducer(cartPersistConfig, cartReducer),
  },
  middleware: [thunk],
})

export default store
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
