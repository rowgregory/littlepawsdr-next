'use client'

import React from 'react'
import { useFetchDashboardDataQuery } from '@redux/services/dashboardApi'
import AdminCommandArea from 'app/components/admin/AdminCommandArea'

const Dashboard = () => {
  useFetchDashboardDataQuery()
  return (
    <>
      <AdminCommandArea type="DASHBOARD" />
    </>
  )
}

export default Dashboard
