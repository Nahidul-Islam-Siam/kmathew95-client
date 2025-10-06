import AdminChangePassword from '@/components/AdminDashboard/AdminDashboardPage/adminChangePassword'
import AdminProfilePage from '@/components/AdminDashboard/AdminDashboardPage/adminProfile'
import React from 'react'

export default function page() {
  return (
    <div>
      <AdminProfilePage />
      <AdminChangePassword/>
    </div>
  )
}
