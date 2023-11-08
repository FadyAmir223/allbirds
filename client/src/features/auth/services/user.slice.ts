import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialState = {
  user: string | null;
};

const initialState: InitialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

export const { setCurrent } = userSlice.actions;
export default userSlice.reducer;
