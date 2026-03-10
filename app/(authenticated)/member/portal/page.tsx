import MemberPortalClient, { AuctionBid, Donation, Subscription, User, WelcomeWienerSupport } from 'app/components/pages/MemberPortalClient'

const mockUser: User = {
  id: 'usr_01',
  firstName: 'Jamie',
  lastName: 'Holloway',
  email: 'jamie@example.com',
  image: null
}

const mockDonations: Donation[] = [
  { id: 'd1', amount: 50, createdAt: new Date('2026-02-14'), status: 'succeeded' },
  { id: 'd2', amount: 25, createdAt: new Date('2026-01-03'), status: 'succeeded' },
  { id: 'd3', amount: 100, createdAt: new Date('2025-12-25'), status: 'succeeded' },
  { id: 'd4', amount: 15, createdAt: new Date('2025-11-10'), status: 'succeeded' }
]

const mockSubscriptions: Subscription[] = [
  { id: 's1', tierName: 'Foster Friend', amount: 15, interval: 'month', status: 'active', nextBillingDate: new Date('2026-04-01') },
  { id: 's2', tierName: 'Pack Guardian', amount: 60, interval: 'month', status: 'active', nextBillingDate: new Date('2026-04-01') },
  { id: 's3', tierName: 'Tail Wagger', amount: 3, interval: 'month', status: 'canceled' },
  { id: 's4', tierName: 'Golden Doxie', amount: 200, interval: 'month', status: 'past_due' }
]

const mockWienerSupports: WelcomeWienerSupport[] = [
  { id: 'w1', dogName: 'Pretzel', dogImage: null, productName: 'Monthly Food Sponsor', amount: 25, createdAt: new Date('2026-02-01') },
  { id: 'w2', dogName: 'Nugget', dogImage: null, productName: 'Vet Visit Sponsor', amount: 50, createdAt: new Date('2026-01-15') },
  { id: 'w3', dogName: 'Biscuit', dogImage: null, productName: 'Weekly Treat Bag', amount: 10, createdAt: new Date('2025-12-10') }
]

const mockAuctionBids: AuctionBid[] = [
  {
    id: 'a1',
    itemName: 'Dachshund Watercolor Print',
    itemImage: null,
    bidAmount: 120,
    isWinner: true,
    auctionEndDate: new Date('2026-02-20'),
    status: 'ended'
  },
  {
    id: 'a2',
    itemName: 'Custom Dog Portrait',
    itemImage: null,
    bidAmount: 85,
    isWinner: false,
    auctionEndDate: new Date('2026-01-30'),
    status: 'ended'
  },
  {
    id: 'a3',
    itemName: 'Handmade Doxie Plush Set',
    itemImage: null,
    bidAmount: 200,
    isWinner: false,
    auctionEndDate: new Date('2025-12-15'),
    status: 'ended'
  },
  {
    id: 'a4',
    itemName: 'Signed Rescue Story Book',
    itemImage: null,
    bidAmount: 45,
    isWinner: false,
    auctionEndDate: new Date('2026-03-20'),
    status: 'active'
  }
]

export default async function MemberPortalPage() {
  return (
    <MemberPortalClient
      user={mockUser}
      donations={mockDonations}
      subscriptions={mockSubscriptions}
      wienerSupports={mockWienerSupports}
      auctionBids={mockAuctionBids}
    />
  )
}
