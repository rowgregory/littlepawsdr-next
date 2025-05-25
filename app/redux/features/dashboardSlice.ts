import { dashboardApi } from "@redux/services/dashboardApi";
import { Reducer, createSlice } from "@reduxjs/toolkit";

export interface DashboardStatePayload {
  openDrawerNavDashboard: boolean;
  campaignsForAdminView: [];
  openModal: boolean;
  openDrawer: boolean;
  loading: boolean;
  error: any;
  totalGrossCampaignRevenue: number;
  totalAdoptionFee: any;
  totalAdoptionFeesCount: any;
  donationCount: any;
  totalDonationAmount: any;
  welcomeWienerOrderCount: any;
  totalWelcomeWienerOrdersAmount: any;
  productOrderCount: any;
  totalProductOrdersAmount: any;
  campaigns: any;
  campaign: any;
}

export const initialDashboardState: DashboardStatePayload = {
  openDrawerNavDashboard: false,
  campaignsForAdminView: [],
  openModal: false,
  openDrawer: false,
  loading: true,
  error: null,
  totalGrossCampaignRevenue: 0,
  totalAdoptionFee: null,
  totalAdoptionFeesCount: null,
  donationCount: null,
  totalDonationAmount: null,
  welcomeWienerOrderCount: null,
  totalWelcomeWienerOrdersAmount: null,
  productOrderCount: null,
  totalProductOrdersAmount: null,
  campaigns: null,
  campaign: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    setOpenDrawerNavDashboard: (state) => {
      state.openDrawerNavDashboard = true;
    },
    setCloseDrawerNavDashboard: (state) => {
      state.openDrawerNavDashboard = false;
    },
    setOpenModal: (state) => {
      state.openModal = true;
    },
    setCloseModal: (state) => {
      state.openModal = false;
    },
    setOpenDrawer: (state) => {
      state.openDrawer = true;
    },
    setCloseDrawer: (state) => {
      state.openDrawer = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        dashboardApi.endpoints.fetchDashboardData.matchFulfilled,
        (state: any, { payload }: any) => {
          // state.totalAdoptionFee = payload.totalAdoptionFee;
          // state.totalAdoptionFeesCount = payload.totalAdoptionFeesCount;
          // state.donationCount = payload.donationCount;
          // state.totalDonationAmount = payload.totalDonationAmount;
          // state.welcomeWienerOrderCount = payload.welcomeWienerOrderCount;
          // state.totalWelcomeWienerOrdersAmount =
          //   payload.totalWelcomeWienerOrdersAmount;
          // state.productOrderCount = payload.productOrderCount;
          // state.totalProductOrdersAmount = payload.totalProductOrdersAmount;
          state.loading = false;
        }
      )
      .addMatcher(
        (action: any) =>
          action.type.endsWith("/rejected") &&
          action.payload?.data?.sliceName === "dashboardApi",
        (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.data.message;
        }
      );
  },
});

export const dashboardReducer =
  dashboardSlice.reducer as Reducer<DashboardStatePayload>;

export const {
  setOpenDrawerNavDashboard,
  setCloseDrawerNavDashboard,
  setOpenModal,
  setCloseModal,
  setOpenDrawer,
  setCloseDrawer,
} = dashboardSlice.actions;
