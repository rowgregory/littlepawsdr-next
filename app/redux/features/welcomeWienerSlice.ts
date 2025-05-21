import { welcomeWienerApi } from "@redux/services/welcomeWienerApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";

interface WelcomeWienerStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string;
  welcomeWieners: [] | any;
  welcomeWiener: {};
  welcomeWienerProducts: [];
  welcomeWienerProduct: {};
}

const initialWelcomeWienerState: WelcomeWienerStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  welcomeWieners: [],
  welcomeWiener: {},
  welcomeWienerProducts: [],
  welcomeWienerProduct: {},
};

export const welcomeWienerSlice = createSlice({
  name: "welcomeWiener",
  initialState: initialWelcomeWienerState,
  reducers: {
    resetWelcomeWienerError: (state: any) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        welcomeWienerApi.endpoints.getWelcomeWieners.matchFulfilled,
        (state, { payload }: any) => {
          state.welcomeWieners = payload.welcomeWieners;
        }
      )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.getWelcomeWiener.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.welcomeWiener = payload.welcomeWiener;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.updateWelcomeWiener.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.createWelcomeWiener.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.deleteWelcomeWiener.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.toggleLive.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.getWelcomeWienerProducts.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.welcomeWienerProducts = payload.welcomeWienerProducts;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.getWelcomeWienerProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.welcomeWienerProduct = payload.welcomeWienerProduct;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.updateWelcomeWienerProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.createWelcomeWienerProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   welcomeWienerApi.endpoints.deleteWelcomeWienerProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      .addMatcher(
        (action: any) =>
          action.type.endsWith("/rejected") &&
          action.payload?.data?.sliceName === "welcomeWienerApi",
        (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.data;
        }
      );
  },
});

export const welcomeWienerReducer =
  welcomeWienerSlice.reducer as Reducer<WelcomeWienerStatePayload>;

export const { resetWelcomeWienerError } = welcomeWienerSlice.actions;
