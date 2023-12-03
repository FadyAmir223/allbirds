import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserInitialState = {
  user: string | null
}

const initialState: UserInitialState = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<string>) => {
      state.user = action.payload
    },
  },
})

export const { setCurrent } = userSlice.actions
export const userReducer = userSlice.reducer
export type { UserInitialState }
