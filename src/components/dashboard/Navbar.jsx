import React, { useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Menu, Transition } from '@headlessui/react'
import { FiMenu, FiBell, FiUser, FiSettings, FiLogOut, FiGlobe } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/menu.png'
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t, i18n } = useTranslation()
  const [notifications] = useState([])

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <nav className="sticky top-0 z-30 bg-secondary1 border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
                focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Menu as="div" className="relative">
              <Menu.Button className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 
                dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white 
                  dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(language.code)}
                            className={`flex items-center w-full gap-2 px-4 py-2 text-sm
                              ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                              ${i18n.language === language.code 
                                ? 'text-primary' 
                                : 'text-gray-700 dark:text-gray-300'}`}
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
              <Menu.Button className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 
                dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                <FiBell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Menu.Button>
              {/* Notifications dropdown */}
            </Menu>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 
                dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
                <img
                  src={logo}
                  alt="User"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  John Doe
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
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white 
                  dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#profile"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <FiUser className="h-4 w-4" />
                          {t('dashboard.navbar.profile')}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#settings"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <FiSettings className="h-4 w-4" />
                          {t('dashboard.navbar.settings')}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#logout"
                          className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <FiLogOut className="h-4 w-4" />
                          {t('dashboard.navbar.logout')}
                        </a>
                      )}
                    </Menu.Item>
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