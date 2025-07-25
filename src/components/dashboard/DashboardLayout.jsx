import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Get user from Redux
  const { user } = useSelector(state => state.auth)

  // Determine if user is admin for styling
  const isAdmin = user?.role === 'admin'

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-gray-100 dark:bg-[#020326]' : 'bg-gray-100 dark:bg-secondary1'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className={`p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-64px)] ${isAdmin ? 'bg-gradient-to-br from-transparent to-primary/5 rounded-lg' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout