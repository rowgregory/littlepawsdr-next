export interface IProduct {
  id: string
  name: string | null
  images: string[]
  description: string | null
  price: number
  shippingPrice: number
  countInStock: number
  isPhysicalProduct: boolean
  isLive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductCreateInputs = {
  name?: string
  images?: string[]
  description?: string
  price?: number
  shippingPrice?: number
  countInStock?: number
  isPhysicalProduct?: boolean
  isLive?: boolean
}

export type ProductUpdateInputs = {
  id: string
  name?: string
  images?: string[]
  description?: string
  price?: number
  shippingPrice?: number
  countInStock?: number
  isPhysicalProduct?: boolean
  isLive?: boolean
}
