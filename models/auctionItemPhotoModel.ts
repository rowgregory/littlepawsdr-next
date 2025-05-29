import mongoose, { Document, Schema } from 'mongoose'

export interface IAuctionItemPhoto extends Document {
  url?: string
  name?: string
  size?: string
  createdAt?: Date
  updatedAt?: Date
}

export const auctionItemPhotoSchema = new Schema<IAuctionItemPhoto>(
  {
    url: { type: String },
    name: { type: String },
    size: { type: String }
  },
  { timestamps: true }
)

const AuctionItemPhoto = mongoose.models.AuctionItemPhoto || mongoose.model<IAuctionItemPhoto>('AuctionItemPhoto', auctionItemPhotoSchema)

export default AuctionItemPhoto
