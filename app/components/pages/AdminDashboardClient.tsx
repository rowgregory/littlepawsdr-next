import AdminPageHeader from 'app/components/common/AdminPageHeader'
import {
  FirebaseCard,
  GoogleAnalyticsCard,
  PusherCard,
  RailwayCard,
  ResendCard,
  StripeCard,
  VercelCard
} from 'app/components/ui/cards/IntegrationCards'
import RescueGroupsCard from 'app/components/ui/cards/RescueGroupsCard'

export default async function AdminDashboardClient({ bypassCode, nextRotationAt }: { bypassCode: string; nextRotationAt: Date }) {
  return (
    <>
      <AdminPageHeader
        label="Admin"
        title="Dashboard"
        description="Overview of your rescue operations"
        bypassCode={bypassCode}
        nextRotationAt={nextRotationAt}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 1000:grid-cols-3 gap-4">
          <StripeCard />
          <GoogleAnalyticsCard />
          <RescueGroupsCard />
          <FirebaseCard />
          <VercelCard />
          <RailwayCard />
          <PusherCard />
          <ResendCard />
        </div>
      </div>
    </>
  )
}
