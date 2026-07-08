import { Suspense } from 'react'
import { VolunteerApplicationClient } from './VolunteerApplicationClient'

export default function VolunteerApplicationPage() {
  return (
    <Suspense fallback={<div />}>
      <VolunteerApplicationClient />
    </Suspense>
  )
}
