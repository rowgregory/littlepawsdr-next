import { Suspense } from 'react'
import { AdoptASeniorClient } from './AdoptASeniorClient'

export default function AdoptASeniorPage() {
  return (
    <Suspense fallback={<div />}>
      <AdoptASeniorClient />
    </Suspense>
  )
}
