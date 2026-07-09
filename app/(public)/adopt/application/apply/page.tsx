import PrivateAdoptionApplicationApplyClient from 'app/(public)/adopt/application/apply/PrivateAdoptionApplicationApplyClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'

export default async function PrivateAdoptionApplicationApplyPage() {
  const result = await hasActiveAdoptionFee()
  return <PrivateAdoptionApplicationApplyClient isActive={result?.isActive} expiresAt={result?.expiresAt} />
}
