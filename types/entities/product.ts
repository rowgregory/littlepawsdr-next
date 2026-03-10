export interface IProduct {
  id: string
  name: string | null
  image: string | null
  images: string[]
  description: string | null
  price: number
  shippingPrice: number
  countInStock: number
  isOutOfStock: boolean | null
  isPhysicalProduct: boolean
  createdAt: Date
  updatedAt: Date
}
