import { adoptionApplicationFeeApi } from "@redux/services/adoptionApplicationFeeApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";
import { AdoptionApplicationFeeStatePayload } from "app/types/adopt-types";

const initialAdoptionApplicationFeeState: AdoptionApplicationFeeStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: "",
  adoptionApplicationFees: [],
  isExpired: true,
  activeSession: {},
  token: "",
  exp: 0,
  statusCode: 0,
  step: {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  },
  formData: null,
};

export const adoptionApplicationFeeSlice = createSlice({
  name: "adoptionApplicationFee",
  initialState: initialAdoptionApplicationFeeState,
  reducers: {
    resetAdoptionFee: (state) => {
      state.error = null;
      state.message = null;
    },
    setStep: (state, { payload }) => {
      state.step = {
        ...state.step,
        ...payload,
      };
    },
    saveFormData: (state, { payload }) => {
      const updatedData = {
        ...payload.inputs,
      };
      state.formData = payload.inputs;

      localStorage.setItem("formData", JSON.stringify(updatedData));
    },
    updateFormData: (state, { payload }) => {
      const localDataString = localStorage.getItem("formData");
      const localData = localDataString ? JSON.parse(localDataString) : {};

      const updatedData = {
        ...localData,
        ...payload.inputs,
      };

      state.formData = payload.inputs;

      localStorage.setItem("formData", JSON.stringify(updatedData));
    },
    loadFormData: (state) => {
      const localDataString = localStorage.getItem("formData");
      const localData = localDataString ? JSON.parse(localDataString) : {};

      if (!localData) {
        console.error("No form data found in local storage");
        return;
      }

      try {
        state.formData = localData;
      } catch (error) {
        console.error("Failed to load form data:", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.getAdoptionApplicationFees
          .matchFulfilled,
        (state, { payload }: any) => {
          state.adoptionApplicationFees = payload.adoptionApplicationFees;
        }
      )
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.createAdoptionApplicationFeePayment
          .matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.token = payload.token;
          state.success = payload.success;
        }
      )
      .addMatcher(
        adoptionApplicationFeeApi.endpoints
          .checkIfUserHasActiveAdoptionFeeSession.matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.isExpired = payload.isExpired;
          state.activeSession = payload.activeSession;
          state.token = payload.token;
          state.success = payload.success;
        }
      )
      .addMatcher(
        adoptionApplicationFeeApi.endpoints.jwtCheckValidityAdoptionFee
          .matchFulfilled,
        (state, { payload }: any) => {
          state.message = payload.message;
          state.isExpired = payload.isExpired;
          state.exp = payload.exp;
          state.statusCode = payload.statusCode;
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

export const {
  resetAdoptionFee,
  setStep,
  saveFormData,
  updateFormData,
  loadFormData,
} = adoptionApplicationFeeSlice.actions;
