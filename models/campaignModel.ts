import mongoose from 'mongoose'

export const SellingFormatEnumValues = ['auction', 'fixed'] as const

export const AuctionItemStatusEnumValues = ['Sold', 'Unsold'] as const

export const WinningBidPaymentStatusValues = ['Pending Fulfillment', 'Complete', 'Awaiting Payment'] as const

export const CampaignStatusEnumValues = ['Pre-Campaign', 'Active Campaign', 'Post-Campaign'] as const

export const BidderStatusEnumValues = ['Registered', 'Bidding', 'Winner'] as const

export const AuctionItemPaymentStatusEnumValues = ['Pending', 'Paid'] as const

export type SellingFormatEnum = (typeof SellingFormatEnumValues)[number]

export type AuctionItemStatusEnum = (typeof AuctionItemStatusEnumValues)[number]

export type WinningBidPaymentStatusEnum = (typeof WinningBidPaymentStatusValues)[number]

export type CampaignStatusEnum = (typeof CampaignStatusEnumValues)[number]

export type BidderStatusEnum = (typeof BidderStatusEnumValues)[number]

export type AuctionItemPaymentStatusEnum = (typeof AuctionItemPaymentStatusEnumValues)[number]

// export type BidEnum = 'Outbid' | 'Top Bid'

const campaignSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction'
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
      fill: { type: String }
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
        'Little Paws Dachshund Rescue is a 501c3 volunteer run organization specializing in finding permanent homes for dachshunds and dachshund mixes!'
    },
    campaignStatus: {
      type: String,
      enum: CampaignStatusEnumValues,
      default: 'Pre-Campaign'
    },
    customCampaignLink: { type: String },
    isCampaignPublished: { type: Boolean, default: true },
    isMoneyRaisedVisible: { type: Boolean, default: true },
    imgPreference: { type: String }
  },
  {
    timestamps: true
  }
)

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)

export { Campaign }
