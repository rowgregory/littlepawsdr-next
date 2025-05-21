import { api } from "./api";

const BASE_URL = "/campaign";

export const campaignApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    createCampaign: build.mutation({
      query: (campaign: any) => ({
        url: `${BASE_URL}/create-campaign`,
        method: "POST",
        body: campaign,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    // getCampaign: build.query({
    //   query: (campaignId: string) => `${BASE_URL}/${campaignId}`,
    //   providesTags: ["Campaign", "Item-Fulfillment"],
    // }),
    fetchCampaigns: build.query({
      query: () => `${BASE_URL}/fetch-campaigns`,
      providesTags: ["Campaign"],
      refetchOnMountOrArgChange: true,
    }),
    updateCampaign: build.mutation({
      query: (campaign: any) => ({
        url: `${BASE_URL}/update-campaign`,
        method: "PUT",
        body: campaign,
      }),
      invalidatesTags: ["Campaign"],
    }),
    // updateAuction: build.mutation({
    //   query: (auction: any) => ({
    //     url: `${BASE_URL}/auction`,
    //     method: "PUT",
    //     body: auction,
    //   }),
    //   invalidatesTags: ["Campaign", "Auction", "Auction-Item"],
    // }),
    // getAuctionItem: build.query({
    //   query: (item: any) => `${BASE_URL}/auction/item/${item?.auctionItemId}`,
    //   providesTags: (result: any, error: any, arg: any) => [
    //     { type: "Auction-Item", id: arg },
    //   ],
    // }),
    // createAuctionItem: build.mutation({
    //   query: (auctionItem: any) => ({
    //     url: `${BASE_URL}/auction/item`,
    //     method: "POST",
    //     body: auctionItem,
    //   }),
    //   invalidatesTags: ["Campaign", "Auction-Item"],
    // }),
    // updateAuctionItem: build.mutation({
    //   query: (auctionItem: any) => ({
    //     url: `${BASE_URL}/auction/item`,
    //     method: "PUT",
    //     body: auctionItem,
    //   }),
    //   invalidatesTags: ["Auction-Item", "Campaign"],
    // }),
    // deleteAuctionItemPhoto: build.mutation({
    //   query: (campaign: any) => ({
    //     url: `${BASE_URL}/auction/item/photo/${campaign.photoId}/${campaign.auctionItemId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Auction-Item", "Campaign"],
    // }),
    // getCampaigns: build.query({
    //   query: () => BASE_URL,
    //   invalidatesTags: ["Campaign"],
    // }),
    // getCampaignsForAdminView: build.query({
    //   query: () => `${BASE_URL}/admin/view`,
    //   invalidatesTags: ["Campaign"],
    // }),
    // getCampaignByCustomLinkId: build.query({
    //   query: (customLinkId: string) =>
    //     `${BASE_URL}/custom-link/${customLinkId}`,
    //   providesTags: (result: any, error: any, arg: any) => [
    //     { type: "Campaign", id: arg },
    //   ],
    // }),
    // createOneTimeAuctionDonation: build.mutation({
    //   query: (auctionDoantion: any) => ({
    //     url: `${BASE_URL}/auction/donation`,
    //     method: "POST",
    //     body: auctionDoantion,
    //   }),
    //   invalidatesTags: ["Campaign"],
    // }),
    // createInstantBuy: build.mutation({
    //   query: (instantBuy: any) => ({
    //     url: `${BASE_URL}/auction/item/instant-buy`,
    //     method: "POST",
    //     body: instantBuy,
    //   }),
    //   invalidatesTags: ["Campaign"],
    // }),
    // placeBid: build.mutation({
    //   query: (bid: any) => ({
    //     url: `${BASE_URL}/auction/item/place-bid`,
    //     method: "POST",
    //     body: bid,
    //   }),
    //   invalidatesTags: ["Campaign", "Auction-Item"],
    // }),
    // getWinningBidder: build.query({
    //   query: (id: string) => `${BASE_URL}/auction/winning-bidder/${id}`,
    //   invalidatesTags: ["Campaign"],
    // }),
    // updateItemFulfillment: build.mutation({
    //   query: (itemFulfillment: any) => ({
    //     url: `${BASE_URL}/auction/item-fulfillment`,
    //     method: "PATCH",
    //     body: itemFulfillment,
    //   }),
    //   invalidatesTags: ["Campaign", "Item-Fulfillment"],
    // }),
    // updateAuctionWinningBidder: build.mutation({
    //   query: (winningBidder: any) => ({
    //     url: `${BASE_URL}/auction/winning-bidder`,
    //     method: "PATCH",
    //     body: winningBidder,
    //   }),
    //   invalidatesTags: ["Campaign"],
    // }),
    // deleteAuctionItem: build.mutation({
    //   query: (auctionItem: any) => ({
    //     url: `${BASE_URL}/auction/item/${auctionItem?.id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Campaign"],
    // }),
    // getCustomCampaignLink: build.query({
    //   query: () => `${BASE_URL}/custom-campaign-link`,
    //   providesTags: ["Campaign"],
    // }),
    // fetchLiveCampaign: build.query({
    //   query: () => `${BASE_URL}/live`,
    //   providesTags: ["Campaign"],
    //   async onQueryStarted(_: any, { dispatch, queryFulfilled }: any) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       dispatch(setCampaign(data.campaign));
    //     } catch (error) {
    //       console.error("Error fetching live campaign:", error);
    //     }
    //   },
    // }),
    // trackAuctionModalButtonClick: build.mutation({
    //   query: (campaignId: any) => {
    //     return {
    //       url: `${BASE_URL}/clicks`,
    //       method: "PATCH",
    //       body: { campaignId },
    //     };
    //   },
    //   invalidatesTags: ["Campaign"],
    // }),
  }),
});

export const {
  useFetchCampaignsQuery,
  useCreateCampaignMutation,
  // useGetCampaignQuery,
  useUpdateCampaignMutation,
  // useUpdateAuctionMutation,
  // useGetAuctionItemQuery,
  // useCreateAuctionItemMutation,
  // useUpdateAuctionItemMutation,
  // useDeleteAuctionItemPhotoMutation,
  // useGetCampaignsQuery,
  // useGetCampaignsForAdminViewQuery,
  // useGetCampaignByCustomLinkIdQuery,
  // useCreateOneTimeAuctionDonationMutation,
  // useCreateInstantBuyMutation,
  // usePlaceBidMutation,
  // useGetWinningBidderQuery,
  // useUpdateItemFulfillmentMutation,
  // useUpdateAuctionWinningBidderMutation,
  // useDeleteAuctionItemMutation,
  // useGetCustomCampaignLinkQuery,
  // useFetchLiveCampaignQuery,
  // useTrackAuctionModalButtonClickMutation,
} = campaignApi;
