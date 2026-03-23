import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  image?: string | null
  price: number
  quantity: number
  isPhysicalProduct: boolean
  shippingPrice?: number
}

interface CartState {
  items: CartItem[]
  isCheckingOut: boolean
  lastUpdated: string
}

const initialCartState: CartState = {
  items: [],
  isCheckingOut: false,
  lastUpdated: new Date().toISOString()
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, { payload }: { payload: CartItem }) => {
      const existing = state.items.find((item) => item.id === payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...payload, quantity: 1 })
      }
      state.lastUpdated = new Date().toISOString()
    },

    removeFromCart: (state, { payload }: { payload: string }) => {
      state.items = state.items.filter((item) => item.id !== payload)
      state.lastUpdated = new Date().toISOString()
    },

    clearCart: (state) => {
      state.items = []
      state.isCheckingOut = false
      state.lastUpdated = new Date().toISOString()
    },
    incrementQuantity: (state, { payload }: { payload: string }) => {
      const item = state.items.find((i) => i.id === payload)
      if (item) {
        item.quantity += 1
        state.lastUpdated = new Date().toISOString()
      }
    },

    decrementQuantity: (state, { payload }: { payload: string }) => {
      const item = state.items.find((i) => i.id === payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        state.lastUpdated = new Date().toISOString()
      }
    }
  }
})

export const { addToCart, removeFromCart, clearCart, decrementQuantity, incrementQuantity } = cartSlice.actions

export const cartReducer = cartSlice.reducer as Reducer
