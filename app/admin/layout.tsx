'use client'

import React, { FC } from 'react'
import AdminHeader from 'app/components/admin/AdminHeader'
import CreateCampaignDrawer from 'app/modals/CreateCampaignDrawer'
import { LayoutProps } from 'app/types/common.types'

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <CreateCampaignDrawer />
      <div className="w-full h-full max-w-[2000px] px-14 mx-auto">{children}</div>
    </>
  )
}

export default AdminLayout
