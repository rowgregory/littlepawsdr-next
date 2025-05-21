import React, { FC, ReactNode } from 'react'

async function AdoptionApplicationLayout({ children, params }: { children: ReactNode; params: any }) {
  const parameters = await params
  const token = parameters.token
  console.log('TOKEN ON ADOPTION APPLICATION LAYOUT: ', token)

  return <div>{children}</div>
}

export default AdoptionApplicationLayout
