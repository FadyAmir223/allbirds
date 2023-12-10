import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserInitialState = {
  isLoggedIn: boolean
}

const initialState: UserInitialState = {
  isLoggedIn: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logUserState: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
    },
  },
})

export const { logUserState } = userSlice.actions
export const userReducer = userSlice.reducer
export type { UserInitialState }
