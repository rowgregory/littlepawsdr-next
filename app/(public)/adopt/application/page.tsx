import { redirect } from 'next/navigation'
import PrivateAdoptionApplicationApplyClient from 'app/(public)/adopt/application/PrivateAdoptionApplicationApplyClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PrivateAdoptionApplicationApplyPage() {
  const result = await hasActiveAdoptionFee().catch(() => ({ isActive: false, expiresAt: null }))

  // No active fee — send them to the pre-application flow to pay it first.
  if (!result?.isActive) {
    redirect('/adopt')
  }

  return <PrivateAdoptionApplicationApplyClient isActive={result.isActive} expiresAt={result.expiresAt ?? null} />
}
