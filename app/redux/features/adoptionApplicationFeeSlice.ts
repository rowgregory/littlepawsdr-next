import { adoptionApplicationFeeApi } from "@redux/services/adoptionApplicationFeeApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";
import { AdoptionApplicationFeeStatePayload } from "app/types/adopt-types";

const initialAdoptionApplicationFeeState: AdoptionApplicationFeeStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  adoptionApplicationFees: [],
};

export const adoptionApplicationFeeSlice = createSlice({
  name: "adoptionApplicationFee",
  initialState: initialAdoptionApplicationFeeState,
  reducers: {
    resetAdoptionFee: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.fetchFees.matchFulfilled,
        (state, { payload }: any) => {
          state.adoptionApplicationFees = payload.adoptionApplicationFees;
        }
      )
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.createPayment.matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.success = payload.success;
        }
      )
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.validateBypassCode.matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.success = payload.success;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action?.payload?.data?.sliceName === "adoptionApplicationFeeApi",
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload.data;
        }
      );
  },
});

export const adoptionApplicationFeeReducuer =
  adoptionApplicationFeeSlice.reducer as Reducer<AdoptionApplicationFeeStatePayload>;

export const { resetAdoptionFee } = adoptionApplicationFeeSlice.actions;
