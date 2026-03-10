export interface AssociatedProduct {
  id: string
  name: string
  price: number
  image?: string
}

export interface WelcomeWiener {
  id: string
  displayUrl: string | null
  name: string | null
  bio: string | null
  age: string | null
  isLive: boolean
  isDogBoost: boolean
  images: string[]
  isPhysicalProduct: boolean
  createdAt: Date
  updatedAt: Date
  associatedProducts: AssociatedProduct[]
}
