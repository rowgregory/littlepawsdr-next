// features/feeExpSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeeExpState {
  exp: number | null;
}

const initialState: FeeExpState = {
  exp: null,
};

const feeExpSlice = createSlice({
  name: "feeExp",
  initialState,
  reducers: {
    setExp(state, action: PayloadAction<number | null>) {
      state.exp = action.payload;
    },
  },
});

export const { setExp } = feeExpSlice.actions;
export const feeExpReducer = feeExpSlice.reducer;
