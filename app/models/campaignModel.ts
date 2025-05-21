import mongoose from "mongoose";

const SellingFormatEnum = ["auction", "fixed"];
const WinningBidPaymentStatus = [
  "Pending Fulfillment",
  "Complete",
  "Awaiting Payment",
];
const CampaignStatusEnum = ["Pre-Campaign", "Active Campaign", "Post-Campaign"];
const BidderStatusEnum = ["Registered", "Bidding", "Winner"];
const BidEnum = ["Outbid", "Top Bid"];
const AuctionItemStatusEnum = ["Sold", "Unsold"];
const AuctionItemPaymentStatusEnum = ["Pending", "Paid"];

const auctionItemPhotoSchema = new mongoose.Schema(
  {
    url: { type: String },
    name: { type: String },
    size: { type: String },
  },
  { timestamps: true }
);

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItem",
    },
    bidAmount: { type: Number },
    bidder: { type: String },
    email: { type: String },
    status: { type: String, enum: BidEnum, default: "Top Bid" },
    sentWinnerEmail: { type: Boolean, default: false },
    emailCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const itemSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },

    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionItemPhoto",
      },
    ],
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    instantBuyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionItemInstantBuyer",
      },
    ],
    name: { type: String },
    description: { type: String },
    sellingFormat: { type: String, enum: SellingFormatEnum },
    startingPrice: { type: Number },
    buyNowPrice: { type: Number },
    currentPrice: { type: Number },
    totalQuantity: { type: Number },
    requiresShipping: { type: Boolean, default: true },
    shippingCosts: { type: Number },
    status: { type: String, enum: AuctionItemStatusEnum, default: "Unsold" },
    currentBid: { type: Number },
    minimumBid: { type: Number },
    totalBids: { type: Number },
    retailValue: { type: String },
    highestBidAmount: { type: Number },
    soldPrice: { type: Number },
    itemBtnText: { type: String },
    topBidder: { type: String },
    isAuction: { type: Boolean },
    isFixed: { type: Boolean },
  },
  { timestamps: true }
);

const auctionDonationSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    donor: { type: String },
    email: { type: String },
    donorPublicMessage: { type: String },
    oneTimeDonationAmount: { type: Number },
    creditCardProcessingFee: { type: Number },
    paypalId: { type: String },
  },
  { timestamps: true }
);

const auctionItemInstantBuyerSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItem",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String },
    email: { type: String },
    paymentStatus: {
      type: String,
      enum: AuctionItemPaymentStatusEnum,
      default: "Paid",
    },
    shippingStatus: { type: String, default: "Pending Fulfillment" },
    shippingProvider: { type: String },
    trackingNumber: { type: String },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

const auctionBidderSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    status: { type: String, enum: BidderStatusEnum, default: "Registered" },
  },
  { timestamps: true }
);

const auctionWinningBidderSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItem",
    },
    winningBidPaymentStatus: {
      type: String,
      enum: WinningBidPaymentStatus,
      default: "Awaiting Payment",
    },
    auctionItemPaymentStatus: {
      type: String,
      enum: AuctionItemPaymentStatusEnum,
      default: "Pending",
    },
    auctionPaymentNotificationEmailHasBeenSent: {
      type: Boolean,
      default: false,
    },
    emailNotificationCount: { type: Number, default: 0 },
    elapsedTimeSinceAuctionItemWon: { type: String },
    processingFee: { type: Number },
    totalPrice: { type: Number },
    shipping: { type: Number },
    shippingStatus: { type: String, default: "Pending Payment Confirmation" },
    shippingProvider: { type: String },
    itemSoldPrice: { type: Number },
    trackingNumber: { type: String },
    payPalId: { type: String },
    paidOn: { type: Date },
  },
  { timestamps: true }
);

const auctionItemFulfillmentSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItem",
    },
    instantBuyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionItemInstantBuyer",
    },
    winningBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionWinningBidder",
    },
    name: { type: String },
    email: { type: String },
    winningBidPaymentStatus: {
      type: String,
      enum: WinningBidPaymentStatus,
      default: "Awaiting Payment",
    },
    auctionItemPaymentStatus: {
      type: String,
      enum: AuctionItemPaymentStatusEnum,
      default: "Pending",
    },
    auctionPaymentNotificationEmailHasBeenSent: {
      type: Boolean,
      default: false,
    },
    emailNotificationCount: { type: Number, default: 0 },
    elapsedTimeSinceAuctionItemWon: { type: String },
    processingFee: { type: Number },
    totalPrice: { type: Number },
    shipping: { type: Number },
    shippingStatus: { type: String, default: "Unfilfilled" },
    shippingProvider: { type: String },
    itemSoldPrice: { type: Number },
    trackingNumber: { type: String },
    payPalId: { type: String },
    isDigital: { type: Boolean },
  },
  { timestamps: true }
);

const auctionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionItem",
        default: [],
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionDonation",
        default: [],
      },
    ],
    bidders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionBidder",
        default: [],
      },
    ],
    winningBids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionWinningBidder",
        default: [],
      },
    ],
    itemFulfillments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionItemFulfillment",
        default: [],
      },
    ],
    settings: {
      type: Object,
      default: () => {
        const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from current date
        const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 week from current date
        endDate.setHours(17, 0, 0, 0); // Set time to 5:00 PM (17:00) with zero minutes, seconds, and milliseconds
        startDate.setHours(9, 0, 0, 0);
        return {
          startDate,
          endDate,
          isAuctionPublished: true,
          anonymousBidding: true,
          hasBegun: false,
          hasEnded: false,
          auctionStatus: "Bidding opens",
          status: "UPCOMING",
        };
      },
    },
  },
  {
    timestamps: true,
  }
);

const auctionButtonStatsSchema = new mongoose.Schema({
  clickCount: {
    type: Number,
    default: 0,
  },
  campaignTitle: {
    type: String,
  },
});

const campaignSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    title: { type: String },
    subtitle: { type: String },
    goal: { type: Number, default: 0 },
    themeColor: {
      xlight: { type: String },
      light: { type: String },
      dark: { type: String },
      darker: { type: String },
      text: { type: String },
      text2: { type: String },
      border: { type: String },
      border2: { type: String },
      borderLight: { type: String },
      gradient: { type: String },
      fill: { type: String },
    },
    coverPhoto: { type: String },
    coverPhotoName: { type: String },
    maintainAspectRatio: { type: Boolean, default: true },
    totalCampaignRevenue: { type: Number, default: 0 },
    supporters: { type: Number, default: 0 },
    supporterEmails: { type: [] },
    story: {
      type: String,
      default:
        "Little Paws Dachshund Rescue is a 501c3 volunteer run organization specializing in finding permanent homes for dachshunds and dachshund mixes!",
    },
    campaignStatus: {
      type: String,
      enum: CampaignStatusEnum,
      default: "Pre-Campaign",
    },
    customCampaignLink: { type: String },
    isCampaignPublished: { type: Boolean, default: true },
    isMoneyRaisedVisible: { type: Boolean, default: true },
    imgPreference: { type: String },
    modalButtonClicks: auctionButtonStatsSchema,
  },
  {
    timestamps: true,
  }
);

const Auction =
  mongoose.models.Auction || mongoose.model("Auction", auctionSchema);
const AuctionItem =
  mongoose.models.AuctionItem || mongoose.model("AuctionItem", itemSchema);
const AuctionItemInstantBuyer =
  mongoose.models.AuctionItemInstantBuyer ||
  mongoose.model("AuctionItemInstantBuyer", auctionItemInstantBuyerSchema);
const AuctionItemPhoto =
  mongoose.models.AuctionItemPhoto ||
  mongoose.model("AuctionItemPhoto", auctionItemPhotoSchema);
const AuctionDonation =
  mongoose.models.AuctionDonation ||
  mongoose.model("AuctionDonation", auctionDonationSchema);
const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
const Bid = mongoose.models.Bid || mongoose.model("Bid", bidSchema);
const AuctionBidder =
  mongoose.models.AuctionBidder ||
  mongoose.model("AuctionBidder", auctionBidderSchema);
const AuctionWinningBidder =
  mongoose.models.AuctionWinningBidder ||
  mongoose.model("AuctionWinningBidder", auctionWinningBidderSchema);
const AuctionItemFulfillment =
  mongoose.models.AuctionItemFulfillment ||
  mongoose.model("AuctionItemFulfillment", auctionItemFulfillmentSchema);
const AuctionButtonStats =
  mongoose.models.AuctionButtonStats ||
  mongoose.model("AuctionButtonStats", auctionButtonStatsSchema);

export {
  Auction,
  AuctionItemInstantBuyer,
  AuctionItem,
  AuctionItemPhoto,
  AuctionDonation,
  Bid,
  Campaign,
  AuctionBidder,
  AuctionWinningBidder,
  AuctionItemFulfillment,
  AuctionButtonStats,
};
