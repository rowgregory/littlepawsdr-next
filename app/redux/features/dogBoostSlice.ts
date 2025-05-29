import { dogBoostApi } from "@redux/services/dogBoostApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";

interface DogBoostStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string;
  dogBoosts: [] | any;
  dogBoost: {};
  dogBoostProducts: [];
  dogBoostProduct: {};
}

const initialDogBoostState: DogBoostStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  dogBoosts: [],
  dogBoost: {},
  dogBoostProducts: [],
  dogBoostProduct: {},
};

export const dogBoostSlice = createSlice({
  name: "dogBoost",
  initialState: initialDogBoostState,
  reducers: {
    resetDogBoostError: (state: any) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        dogBoostApi.endpoints.getDogBoosts.matchFulfilled,
        (state, { payload }: any) => {
          state.dogBoosts = payload.DogBoosts;
        }
      )
      // .addMatcher(
      //   dogBoostApi.endpoints.getDogBoost.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.DogBoost = payload.DogBoost;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.updateDogBoost.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.createDogBoost.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.deleteDogBoost.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.toggleLive.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.getDogBoostProducts.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.DogBoostProducts = payload.DogBoostProducts;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.getDogBoostProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.DogBoostProduct = payload.DogBoostProduct;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.updateDogBoostProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.createDogBoostProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   dogBoostApi.endpoints.deleteDogBoostProduct.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      .addMatcher(
        (action: any) =>
          action.type.endsWith("/rejected") &&
          action.payload?.data?.sliceName === "dogBoostApi",
        (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.data;
        }
      );
  },
});

export const dogBoostReducer =
  dogBoostSlice.reducer as Reducer<DogBoostStatePayload>;

export const { resetDogBoostError } = dogBoostSlice.actions;
