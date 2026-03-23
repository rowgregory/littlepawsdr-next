import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { cartReducer } from './slices/cartSlice'
import { welcomeWienerReducer } from './slices/welcomeWienerSlice'
import { userReducer } from './slices/userSlice'
import { formReducer } from './slices/formSlice'
import { uiReducer } from './slices/uiSlice'
import { toastReducer } from './slices/toastSlice'

const rootReducer = combineReducers({
  cart: cartReducer,
  welcomeWiener: welcomeWienerReducer,
  user: userReducer,
  form: formReducer,
  ui: uiReducer,
  toast: toastReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppSelector = typeof store.getState
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useFormSelector = () => useAppSelector((state: RootState) => state.form)
export const useUiSelector = () => useAppSelector((state: RootState) => state.ui)
export const useToastSelector = () => useAppSelector((state: RootState) => state.toast)
export const useCartSelector = () => useAppSelector((state: RootState) => state.cart)
