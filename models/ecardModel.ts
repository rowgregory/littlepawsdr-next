import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IECard extends Document {
  category?: string
  price?: number
  image?: string
  name?: string
  createdAt?: Date
  updatedAt?: Date
}

const eCardSchema: Schema<IECard> = new mongoose.Schema(
  {
    category: { type: String },
    price: { type: Number },
    image: { type: String },
    name: { type: String }
  },
  {
    timestamps: true
  }
)

const ECard: Model<IECard> = mongoose.model<IECard>('ECard', eCardSchema)

export default ECard
