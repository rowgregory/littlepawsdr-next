import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { navbarReducer } from "./features/navbarSlice";
import { dachshundReducer } from "./features/dachshundSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./features/authSlice";
import { cartReducer } from "./features/cartSlice";
import { api } from "./services/api";
import { welcomeWienerReducer } from "./features/welcomeWienerSlice";
import { rescueGroupsApi } from "./services/rescueGroupsApi";
import { adoptionApplicationFeeReducuer } from "./features/adoptionApplicationFeeSlice";
import { userReducer } from "./features/userSlice";
import { dashboardReducer } from "./features/dashboardSlice";
import { campaignReducer } from "./features/campaignSlice";

const rootReducer = combineReducers({
  navbar: navbarReducer,
  dachshund: dachshundReducer,
  auth: authReducer,
  cart: cartReducer,
  welcomeWiener: welcomeWienerReducer,
  adoptionApplicationFee: adoptionApplicationFeeReducuer,
  user: userReducer,
  dashboard: dashboardReducer,
  campaign: campaignReducer,
  [rescueGroupsApi.reducerPath]: rescueGroupsApi.reducer,
  [api.reducerPath]: api.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(rescueGroupsApi.middleware)
      .concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppSelector = typeof store.getState;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
