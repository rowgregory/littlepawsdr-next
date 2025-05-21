'use client'

import React, { FC } from 'react'
import { ChildrenProps } from 'app/types/general-types'
import AdminHeader from 'app/components/admin/AdminHeader'
import CreateCampaignDrawer from 'app/modals/CreateCampaignDrawer'

const AdminLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <CreateCampaignDrawer />
      <div className="w-full h-full max-w-[2000px] px-14 mx-auto">{children}</div>
    </>
  )
}

export default AdminLayout
