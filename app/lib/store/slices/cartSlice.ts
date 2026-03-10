import { Reducer, createSlice } from '@reduxjs/toolkit'

const initialCartState = {}

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {}
})

export const cartReducer = cartSlice.reducer as Reducer

export const {} = cartSlice.actions
