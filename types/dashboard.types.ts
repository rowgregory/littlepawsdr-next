export interface RecentOrder {
  id: string
  total: number
  createdAt: string
  name: string
  type?: string
}
export interface WienerRevenue {
  id: string
  name: string
  totalRaised: number
  sponsorCount: number
}
export interface AdoptionFeeDay {
  date: string
  count: number
  amount: number
}

export interface DashboardStats {
  totalRevenue: number
  totalOrderRevenue: number
  totalAdoptionRevenue: number
  auctionRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  monthlyChange: number
  activeAuctions: number
  totalUsers: number
  newThisMonth: number
  newsletterCount: number
  welcomeWienerCount: number
  welcomeWienerRevenue: WienerRevenue[]
  productCount: number
  bypassCode: string | null
  bypassCodeRotatesAt: string | null
  monthlyData: { label: string; orders: number; adoptions: number }[]
  recentOrders: RecentOrder[]
  // order counts by type
  ordersByType: { type: string; count: number; total: number }[]
  // adoption fee heatmap data — last 16 weeks
  adoptionFeeHeatmap: AdoptionFeeDay[]
  totalAdoptionFees: number
  adoptionFeesThisMonth: number
}

export interface DachshundPreview {
  id: string
  name: string
  age: string
  sex: string
  status: string
}
export interface PendingShipment {
  id: string
  name: string
  items: string
  total: number
  createdAt: string
  address: string
}
export interface Props {
  stats: DashboardStats
  dachshunds?: DachshundPreview[]
  pendingShipments?: PendingShipment[]
}
