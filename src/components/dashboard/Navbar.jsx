import React, { useState, useEffect, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Menu, Transition } from '@headlessui/react'
import { FiMenu, FiBell, FiUser, FiSettings, FiLogOut, FiGlobe, FiHome, FiArrowLeft, FiShield, FiSun, FiMoon } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/menu.png'
import { useTheme } from '../../context/ThemeContext'
import { clearSelectedBusiness } from '../../redux/apiCalls/businessApiCalls'
import { logoutUser } from '../../redux/apiCalls/authApiCalls'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [notifications] = useState([])
  const { darkMode, toggleDarkMode } = useTheme()

  // Get user and selected business from Redux
  const { user } = useSelector(state => state.auth)
  const { selectedBusiness } = useSelector(state => state.business)

  // Try to get business from localStorage if not in Redux
  const [localBusiness, setLocalBusiness] = useState(null)

  useEffect(() => {
    if (!selectedBusiness) {
      try {
        const storedBusinessString = localStorage.getItem('selectedBusiness')
        if (storedBusinessString) {
          const storedBusiness = JSON.parse(storedBusinessString)
          setLocalBusiness(storedBusiness)
        }
      } catch (error) {
        // Silent error handling
      }
    }
  }, [selectedBusiness])

  // Use business from Redux or localStorage
  const activeBusiness = selectedBusiness || localBusiness

  // Determine if we should show business info (only for non-admin users with a selected business)
  const showBusinessInfo = user?.role !== 'admin' && activeBusiness

  // Determine if user is admin for styling
  const isAdmin = user?.role === 'admin'

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <nav className={`sticky top-0 z-30 backdrop-blur-sm ${
      isAdmin
        ? darkMode
          ? 'bg-gradient-to-r from-secondary1/90 via-[#0a1a4d]/95 to-secondary1/90 border-b border-primary/20'
          : 'bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-b border-primary/20'
        : darkMode
          ? 'bg-gradient-to-r from-secondary1/95 via-secondary1/98 to-secondary1/95 border-b border-gray-800/30'
          : 'bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Center - Business Info (for client users) or Admin Badge (for admin users) */}
          <div className="hidden md:flex items-center gap-2">
            {showBusinessInfo ? (
              <Link
                to={`/dashboard/my-business/${activeBusiness._id}`}
                className="group transition-all duration-200 hover:-translate-y-0.5"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl border shadow-lg backdrop-blur-md
                    transition-all duration-200 ${
                    darkMode
                      ? 'bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border-primary/20 shadow-primary/5 hover:bg-primary/20 hover:border-primary/30'
                      : 'bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-blue-200 shadow-blue-100/20 hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={activeBusiness.logo?.url || logo}
                      alt={activeBusiness.nom}
                      className={`h-8 w-8 rounded-lg object-cover ring-2 ring-offset-2 group-hover:ring-primary/50 transition-all duration-200 ${
                        darkMode
                          ? 'ring-primary/30 ring-offset-secondary1'
                          : 'ring-primary/40 ring-offset-white'
                      }`}
                    />
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 ${
                      darkMode ? 'border-secondary1' : 'border-white'
                    }`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold group-hover:text-primary transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {activeBusiness.nom}
                    </span>
                    <span className="text-xs text-primary/70">
                      {t('dashboard.navbar.active')}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ) : isAdmin && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-r from-primary/20 via-primary/25 to-primary/20 border-primary/30 shadow-primary/10'
                  : 'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 border-blue-300 shadow-blue-100/30'
              }`}>
                <FiShield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {t('dashboard.navbar.adminMode')}
                </span>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
              aria-label={darkMode ? t('common.lightMode') : t('common.darkMode')}
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {/* Language Selector */}
            <Menu as="div" className="relative">
              <Menu.Button className={`relative p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                <div className="flex items-center gap-2">
                  <FiGlobe className="h-5 w-5" />
                  <span className="hidden sm:block text-sm">
                    {languages.find(lang => lang.code === i18n.language)?.flag}
                  </span>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none ${
                  darkMode
                    ? 'bg-gray-800 ring-gray-700'
                    : 'bg-white ring-gray-200'
                }`}>
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(language.code)}
                            className={`flex items-center w-full gap-2 px-4 py-2 text-sm
                              ${active
                                ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                : ''
                              }
                              ${i18n.language === language.code
                                ? 'text-primary'
                                : darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}
                          >
                            <span>{language.flag}</span>
                            <span>{language.label}</span>
                            {i18n.language === language.code && (
                              <span className="ml-auto text-primary">✓</span>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button className={`relative p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                <FiBell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Menu.Button>
              {/* Notifications dropdown */}
            </Menu>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className={`flex items-center gap-2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                ${isAdmin
                  ? darkMode ? 'hover:bg-primary/10' : 'hover:bg-blue-50'
                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                <div className={`relative ${
                  isAdmin
                    ? `ring-2 ring-primary ring-offset-2 ${darkMode ? 'ring-offset-secondary1' : 'ring-offset-white'} rounded-full`
                    : 'rounded-full'
                }`}>
                  <img
                    src={user?.profile?.url}
                    alt={user?.nom || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  {isAdmin && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5">
                      <FiShield className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <span className={`hidden sm:block text-sm font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {user?.nom || user?.name || 'User'}
                </span>
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none ${
                  darkMode
                    ? 'bg-gray-800 ring-gray-700'
                    : 'bg-white ring-gray-200'
                }`}>
                  <div className="py-1">
                    {/* Profile link */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/dashboard/profile/${user.id}`}
                          className={`flex items-center gap-2 px-4 py-2 text-sm text-primary ${
                            active
                              ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              : ''
                          }`}
                        >
                          <FiUser className="h-4 w-4" />
                          {t('dashboard.navbar.profile')}
                        </Link>
                      )}
                    </Menu.Item>

                    {/* Settings link */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard/settings"
                          className={`flex items-center gap-2 px-4 py-2 text-sm text-primary ${
                            active
                              ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              : ''
                          }`}
                        >
                          <FiSettings className="h-4 w-4" />
                          {t('dashboard.navbar.settings') || 'Settings'}
                        </Link>
                      )}
                    </Menu.Item>

                    {/* Logout for admin users */}
                    {user?.role === 'admin' && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              // Just dispatch logout - ProtectedRoute will handle navigation
                              dispatch(logoutUser());
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 w-full text-left ${
                              active
                                ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                : ''
                            }`}
                          >
                            <FiLogOut className="h-4 w-4" />
                            {t('dashboard.navbar.logout')}
                          </button>
                        )}
                      </Menu.Item>
                    )}

                    {/* Quit button for client users */}
                    {user?.role !== 'admin' && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              dispatch(clearSelectedBusiness());
                              navigate('/business');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm text-orange-600 w-full text-left ${
                              active
                                ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                : ''
                            }`}
                          >
                            <FiArrowLeft className="h-4 w-4" />
                            {t('dashboard.navbar.quitBusiness') || 'Quit Business'}
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar