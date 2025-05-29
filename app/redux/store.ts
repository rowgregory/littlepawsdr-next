import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { navbarReducer } from './features/navbarSlice'
import { dachshundReducer } from './features/dachshundSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authReducer } from './features/authSlice'
import { cartReducer } from './features/cartSlice'
import { api } from './services/api'
import { dogBoostReducer } from './features/dogBoostSlice'
import { rescueGroupsApi } from './services/rescueGroupsApi'
import { userReducer } from './features/userSlice'
import { dashboardReducer } from './features/dashboardSlice'
import { campaignReducer } from './features/campaignSlice'
import { formReducer } from './features/form/formSlice'
import { feeExpReducer } from './features/feeExpSlice'
import { stripeReducer } from './features/stripeSlice'
import { adoptFeeReducuer } from './features/adoptFeeSlice'

const rootReducer = combineReducers({
  navbar: navbarReducer,
  dachshund: dachshundReducer,
  auth: authReducer,
  cart: cartReducer,
  DogBoost: dogBoostReducer,
  adoptionApplicationFee: adoptFeeReducuer,
  user: userReducer,
  dashboard: dashboardReducer,
  campaign: campaignReducer,
  form: formReducer,
  feeExp: feeExpReducer,
  stripe: stripeReducer,
  [rescueGroupsApi.reducerPath]: rescueGroupsApi.reducer,
  [api.reducerPath]: api.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
      .concat(rescueGroupsApi.middleware)
      .concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppSelector = typeof store.getState
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
