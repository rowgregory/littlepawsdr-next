interface AuctionItemCardBodyProps {
  item: {
    _id: string;
    name: string;
    isAuction: boolean;
    isFixed: boolean;
    totalBids: number;
    bids: Array<{ id: string }>;
    currentBid: number;
    buyNowPrice: number;
    totalQuantity: number;
    soldPrice?: number;
    itemBtnText: string;
    topBidder?: string;
  };
  hasEnded: boolean;
  auth: {
    user?: {
      _id: string;
      shippingAddress?: string;
      hasShippingAddress: boolean;
    };
  };
  pathname: string;
  theme: {
    border: string;
    text: string;
    darker: string;
    xlight: string;
  };
  setOpenShippingAddressModal: (args: { open: boolean; auctionItemId: string }) => void;
  status: string;
  customLinkId: string | undefined;
}

type AuctionItemTimerRibbonProps = {
  item: any;
  theme: any;
  hasEnded: boolean;
  hasBegun: boolean;
  campaign: any;
};

interface ThemeProps {
  xlight: string;
  light: string;
  dark: string;
  darker: string;
  text: string;
  text2: string;
  gradient: string;
  border: string;
  border2: string;
  fill: string;
}

interface CampaignPayload {
  _id: string;
  title: string;
  subtitle: string;
  goal: number;
  themeColor: ThemeProps;
  coverPhoto: string;
  coverPhotoName: string;
  maintainAspectRatio: boolean;
  totalCampaignRevenue: number;
  supporters: number;
  story: string;
  customCampaignLink: string;
  isCampaignPublished: boolean;
  isMoneyRaisedVisible: boolean;
  isTipsEnabled: boolean;
  campaignStatus: string;
  auction: {
    _id: string;
    settings: {
      startDate: string;
      endDate: string;
      isAuctionPublished: boolean;
      anonymousBidding: boolean;
      hasBegun: boolean;
      hasEnded: boolean;
      auctionStatus: string;
    };
    donations: [];
    items: [];
    bidders: [];
    winningBids: [];
    itemFulfillments: [];
    instantBuyers: [];
  };
  imgPreference: string;
}

interface AuctionItemStatePayload {
  _id: string;
  name: string;
  description: string;
  photos: [
    {
      _id: string;
      url: string;
      name: string;
      size: string;
    }
  ];
  instantBuyers: [];
  sellingFormat: string;
  startingPrice: number;
  buyNowPrice: number;
  totalQuantity: number;
  requiresShipping: boolean;
  shippingCosts: number;
  currentBid: number;
  minimumBid: number;
  totalBids: number;
  bidIncrement: number;
  retailValue: number;
  highestBidAmount: number;
  bids: [];
  total: number;
  topBidder: string;
  soldPrice: number;
}

interface AuctionItemWinnerPayload {
  _id: string;
  auctionItemPaymentStatus: String;
  hasShippingAddress: boolean;
  itemSoldPrice: number;
  shipping: number;
  totalPrice: number;
  theme: ThemeProps;
  user: {
    name: string;
  };
  auctionItem: AuctionItemStatePayload;
  customCampaignLink: string;
}

interface PublicCampaignsPayload {
  upcoming: [];
  active: [];
  past: [];
}

interface CampaignStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  message: string | null;
  campaignId: string;
  detailsId: string;
  sharingId: string;
  auctionId: string;
  settingsId: string;
  campaigns: PublicCampaignsPayload;
  campaignsForAdminView: [];
  campaign: CampaignPayload;
  auctionItem: AuctionItemStatePayload;
  instantBuy: {} | any;
  confirmedBidAmount: number;
  type: string;
  winner: AuctionItemWinnerPayload;
  customCampaignLink: string;
  status: string;
  hasHandledAuctionModal: boolean;
  isAuctionModalOpen: boolean;
  campaignStatus: string;
  text: string;
  filteredArray: {}[];
  sortKey: string;
  sortDirection: string;
  sortedData: {}[];
}

export type { AuctionItemCardBodyProps, AuctionItemTimerRibbonProps, CampaignStatePayload };
