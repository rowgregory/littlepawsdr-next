import { campaignApi } from "@redux/services/campaignApi";
import { Reducer, createSlice, original } from "@reduxjs/toolkit";

interface CampaignState {
  success: boolean;
  error: string | null;
  message: string | null;
  hasHandledAuctionModal: boolean;
  isAuctionModalOpen: boolean;
  campaignId: string | null;
  campaign: any; // Replace 'any' with a more specific type if available
  text: string | null;
  filteredArray: any[]; // Replace 'any[]' with more specific types if possible
  sortKey: string | null;
  sortDirection: "asc" | "desc";
  auctionItem: any | null; // Replace 'any' with the actual type of the auction item
  campaigns: any[]; // Replace 'any[]' with more specific types if possible
  campaignsForAdminView: any[]; // Replace 'any[]' with more specific types if possible
  customCampaignLink: string | null;
  campaignStatus: string | null;
  confirmedBidAmount: number | null;
  winner: any | null; // Replace 'any' with a more specific type if available
  instantBuy: any | null; // Replace 'any' with the actual type for instant buy data
  loading: boolean;
  type: string | null;
}

const initialCampaignState: CampaignState = {
  success: false,
  error: null,
  message: null,
  hasHandledAuctionModal: false,
  isAuctionModalOpen: false,
  campaignId: null,
  campaign: {},
  text: null,
  filteredArray: [],
  sortKey: null,
  sortDirection: "asc",
  auctionItem: null,
  campaigns: [],
  campaignsForAdminView: [],
  customCampaignLink: null,
  campaignStatus: null,
  confirmedBidAmount: null,
  winner: null,
  instantBuy: null,
  loading: false,
  type: null,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: initialCampaignState,
  reducers: {
    resetCampaignSuccess: (state) => {
      state.success = false;
    },
    setCurrentCampaign: (state, { payload }: any) => {
      const campaigns = original(state.campaigns);
      state.campaign = campaigns?.find((campaign) => campaign._id === payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )

      .addMatcher(
        campaignApi.endpoints.createCampaign.matchFulfilled,
        (state, { payload }: any) => {
          state.campaignId = payload.campaignId;
          state.loading = false;
        }
      )
      .addMatcher(
        campaignApi.endpoints.updateCampaign.matchFulfilled,
        (state) => {
          state.loading = false;
          state.success = true;
        }
      )
      .addMatcher(
        campaignApi.endpoints.fetchCampaigns.matchFulfilled,
        (state, { payload }: any) => {
          state.campaigns = payload.campaigns;
          state.loading = false;
        }
      )
      // .addMatcher(
      //   campaignApi.endpoints.getCampaign.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.campaign = payload.campaign;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.updateAuction.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //     state.success = true;
      //     state.type = payload.type;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.createAuctionItem.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.updateAuctionItem.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getAuctionItem.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.auctionItem = payload.auctionItem;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.deleteAuctionItemPhoto.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getCampaigns.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.campaigns = payload.campaigns;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getCampaignsForAdminView.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.campaignsForAdminView = payload.campaigns;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getCampaignByCustomLinkId.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.campaign = payload.campaign;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.createOneTimeAuctionDonation.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.createInstantBuy.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.instantBuy = payload.instantBuy;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.placeBid.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //     state.confirmedBidAmount = payload.confirmedBidAmount;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getWinningBidder.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.winner = payload.winningBidder;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.updateAuctionWinningBidder.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //     state.success = true;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.updateItemFulfillment.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.deleteAuctionItem.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.getCustomCampaignLink.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.customCampaignLink = payload.customCampaignLink;
      //     state.campaignStatus = payload.campaignStatus;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.fetchLiveCampaign.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.campaign = payload.campaign;
      //   }
      // )
      // .addMatcher(
      //   campaignApi.endpoints.trackAuctionModalButtonClick.matchFulfilled,
      //   (state, { payload }: any) => {
      //     state.message = payload.message;
      //   }
      // )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.payload?.data?.sliceName === "campaignApi",
        (state, action: any) => {
          state.loading = false;
          state.success = false;
          state.error = action.error.message;
        }
      );
  },
});

export const campaignReducer = campaignSlice.reducer as Reducer;

export const {
  resetCampaignSuccess,
  setCurrentCampaign,
  // resetCampaignError,
  // saveHasHandledAuctionModalToLocalStorage,
  // setCampaign,
  // closeAuctionModal,
  // setSearchQuery,
  // setInitialArray,
  // sortTable,
} = campaignSlice.actions;
