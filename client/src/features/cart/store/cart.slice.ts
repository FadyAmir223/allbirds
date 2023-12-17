import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CartProduct,
  ProductSignature,
  PureCartProduct,
} from '../types/cart.type'
import { RootState } from '@/store/store'

type CartInitialState = {
  isOpen: boolean
  totalAmount: number
  totalPrice: number
  items: CartProduct[]
}

const initialState: CartInitialState = {
  isOpen: false,
  totalAmount: 0,
  totalPrice: 0,
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },

    addCartItem: (state, action: PayloadAction<PureCartProduct>) => {
      const { payload } = action
      const { handle, editionId, size } = payload

      const productExist = state.items.find(
        (product) =>
          handle === product.handle &&
          editionId === product.editionId &&
          size === product.size,
      )

      if (productExist) {
        state.items = state.items.map((product) =>
          handle === product.handle &&
          editionId === product.editionId &&
          size === product.size
            ? { ...product, amount: product.amount + 1 }
            : product,
        )
      } else {
        state.items.push({ ...payload, amount: 1 })
      }

      updateTotalPrice(state)
    },

    removeCartItem: (state, action: PayloadAction<ProductSignature>) => {
      const { handle, editionId, size } = action.payload

      state.items.forEach((item) => {
        if (
          handle === item.handle &&
          editionId === item.editionId &&
          size === item.size
        ) {
          if (item.amount === 1)
            state.items = state.items.filter(
              (item) =>
                !(
                  handle === item.handle &&
                  editionId === item.editionId &&
                  size === item.size
                ),
            )
          else
            state.items = state.items.map((item) =>
              handle === item.handle &&
              editionId === item.editionId &&
              size === item.size
                ? { ...item, amount: item.amount - 1 }
                : item,
            )

          updateTotalPrice(state)
          return
        }
      })
    },

    deleteCartItem: (state, action: PayloadAction<ProductSignature>) => {
      const { handle, editionId, size } = action.payload

      state.items = state.items.filter(
        (item) =>
          !(
            handle === item.handle &&
            editionId === item.editionId &&
            size === item.size
          ),
      )

      updateTotalPrice(state)
    },

    clearCart: (state) => {
      state.items = []
      updateTotalPrice(state)
    },
  },
})

function updateTotalPrice(state: Omit<RootState['cart'], '_persist'>) {
  const { totalAmount, totalPrice } = state.items.reduce(
    (acc, item) => {
      acc.totalAmount += item.amount
      acc.totalPrice += item.amount * (item.salePrice || item.price)
      return acc
    },
    { totalAmount: 0, totalPrice: 0 },
  )

  state.totalAmount = totalAmount
  state.totalPrice = totalPrice
}

export const {
  toggleCart,
  addCartItem,
  removeCartItem,
  deleteCartItem,
  clearCart,
} = cartSlice.actions
export const cartReducer = cartSlice.reducer
export type { CartInitialState }
