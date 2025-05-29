import { adoptFeeApi } from "@redux/services/adoptFeeApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";
import { AdoptFeeStatePayload } from "app/types/adopt-types";

const initialAdoptFeeState: AdoptFeeStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  adoptFees: [],
};

export const adoptFeeSlice = createSlice({
  name: "adoptFee",
  initialState: initialAdoptFeeState,
  reducers: {
    resetAdoptionFee: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adoptFeeApi.endpoints.fetchAdoptFees.matchFulfilled,
        (state, { payload }: any) => {
          state.adoptFees = payload.adoptFees;
        }
      )
      .addMatcher(
        adoptFeeApi.endpoints.validateBypassCode.matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.success = payload.success;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action?.payload?.data?.sliceName === "adoptFeeApi",
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload.data;
        }
      );
  },
});

export const adoptFeeReducuer =
  adoptFeeSlice.reducer as Reducer<AdoptFeeStatePayload>;

export const { resetAdoptionFee } = adoptFeeSlice.actions;
