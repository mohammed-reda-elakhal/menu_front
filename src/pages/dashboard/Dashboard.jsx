import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

const Dashboard = () => {
  const navigate = useNavigate()
  const { selectedBusiness } = useSelector(state => state.business)
  const { user } = useSelector(state => state.auth)

  // Check if a business is selected (only for non-admin users)
  useEffect(() => {
    // Skip this check for admin users - they don't need a selected business
    if (user?.role === 'admin') {
      return
    }

    // For client users, check if a business is selected in Redux or localStorage
    if (!selectedBusiness) {
      // Try to get business from localStorage as a fallback
      try {
        const storedBusinessString = localStorage.getItem('selectedBusiness')
        if (!storedBusinessString) {
          // If no business in localStorage either, redirect to business page
          navigate('/business')
        }
      } catch (error) {
        // If error accessing localStorage, redirect to business page
        navigate('/business')
      }
    }
  }, [selectedBusiness, navigate, user])

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default Dashboard