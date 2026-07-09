import PrivateAdoptionApplicationApplyClient from 'app/(public)/adopt/application/apply/PrivateAdoptionApplicationApplyClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PrivateAdoptionApplicationApplyPage() {
  const result = await hasActiveAdoptionFee().catch(() => ({ isActive: false, expiresAt: null }))

  return (
    <PrivateAdoptionApplicationApplyClient isActive={result?.isActive ?? false} expiresAt={result?.expiresAt ?? null} />
  )
}
