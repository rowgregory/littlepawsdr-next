export type WelcomeWienerCategory = 'gear' | 'medical' | 'food' | 'comfort' | 'training' | 'enrichment'

export interface WelcomeWienerProduct {
  id: string
  name: string
  description: string
  price: number
  category: WelcomeWienerCategory
  image?: string
}

export interface IWelcomeWiener {
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
  associatedProducts: WelcomeWienerProduct[]
}

export type WelcomeWienerInputs = {
  displayUrl?: string
  name?: string
  bio?: string
  age?: string
  isLive?: boolean
  isDogBoost?: boolean
  images?: string[]
  isPhysicalProduct?: boolean
  associatedProducts?: WelcomeWienerProduct[]
}
