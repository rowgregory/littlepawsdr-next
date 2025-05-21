import { Reducer, createSlice } from "@reduxjs/toolkit";
import {
  addNewCartItem,
  addToExistingCartItem,
  cartDeleteItemSuccess,
  cartRemoveItem,
} from "app/utils/cartHelpers";

interface CartStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message?: string;
  cartItems: [];
  cartItem: {};
  cartDrawer: boolean;
  cartItemsAmount: number;
  subtotal: number;
  shippingPrice: number;
  isPhysicalProduct: boolean;
  totalPrice: number;
  defer: boolean;
}

const initialCartState: CartStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  cartItems: [],
  cartItem: {},
  cartDrawer: false,
  cartItemsAmount: 0,
  subtotal: 0,
  shippingPrice: 0,
  isPhysicalProduct: false,
  totalPrice: 0,
  defer: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    toggleCartDrawer: (state, { payload }) => {
      state.cartDrawer = payload;
    },
    addToCart: (state, { payload }) => {
      const item = payload.item;
      const existingItem: any = state.cartItems.find((x: any) =>
        item?.dachshundId
          ? x?.productId === item?.productId &&
            x?.dachshundId === item?.dachshundId
          : (x?.productId === item?.productId && x?.size === item?.size) ||
            (x?.productId === item?.productId && item?.isEcard)
      );

      if (existingItem) {
        return addToExistingCartItem(item, state, existingItem);
      }
      return addNewCartItem(item, state);
    },
    removeFromCart: (state, { payload }) => {
      const item = payload.item;
      return cartRemoveItem(item, state);
    },
    deleteProductFromCart: (state, { payload }) => {
      const item = payload.item;
      return cartDeleteItemSuccess(item, state);
    },
    resetCart: () => {
      return initialCartState;
    },
  },
});

export const cartReducer = cartSlice.reducer as Reducer<CartStatePayload>;

export const {
  toggleCartDrawer,
  addToCart,
  removeFromCart,
  deleteProductFromCart,
  resetCart,
} = cartSlice.actions;
