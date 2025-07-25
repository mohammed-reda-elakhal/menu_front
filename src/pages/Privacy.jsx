import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  FiShield, FiLock, FiUserCheck, FiDatabase,
  FiServer, FiShare2, FiClock, FiAlertTriangle
} from 'react-icons/fi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTheme } from '../context/ThemeContext'

const Privacy = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  const policies = [
    {
      icon: <FiShield />,
      title: t('privacy.dataProtection.title'),
      description: t('privacy.dataProtection.description')
    },
    {
      icon: <FiLock />,
      title: t('privacy.security.title'),
      description: t('privacy.security.description')
    },
    {
      icon: <FiUserCheck />,
      title: t('privacy.userRights.title'),
      description: t('privacy.userRights.description')
    },
    {
      icon: <FiDatabase />,
      title: t('privacy.dataStorage.title'),
      description: t('privacy.dataStorage.description')
    }
  ];

  const businessTypes = [
    {
      icon: <FiServer />,
      title: t('privacy.businessTypes.restaurant.title'),
      description: t('privacy.businessTypes.restaurant.description')
    },
    {
      icon: <FiShare2 />,
      title: t('privacy.businessTypes.cafe.title'),
      description: t('privacy.businessTypes.cafe.description')
    },
    {
      icon: <FiClock />,
      title: t('privacy.businessTypes.snack.title'),
      description: t('privacy.businessTypes.snack.description')
    }
  ];

  const dataUsageSections = [
    {
      icon: <FiServer />,
      title: t('privacy.dataUsage.management.title'),
      points: t('privacy.dataUsage.management.points', { returnObjects: true })
    },
    {
      icon: <FiShare2 />,
      title: t('privacy.dataSharing.title'),
      points: t('privacy.dataSharing.points', { returnObjects: true })
    },
    {
      icon: <FiClock />,
      title: t('privacy.dataRetention.title'),
      points: t('privacy.dataRetention.points', { returnObjects: true })
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      <Header />

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.title')}
            </h1>
            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
              {t('privacy.subtitle')}
            </p>
          </motion.div>

          {/* Privacy Policies */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`backdrop-blur-sm p-6 rounded-xl border hover:border-opacity-40 transition-all duration-300
                  ${darkMode
                    ? 'bg-secondary1/50 border-primary/20 hover:border-primary/40'
                    : 'bg-white/80 border-blue-200 hover:border-blue-300'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg text-xl transition-colors duration-300
                    ${darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'}`}>
                    {policy.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {policy.title}
                    </h3>
                    <p className={`transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                      {policy.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Business Types Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.businessTypes.title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {businessTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`backdrop-blur-sm p-6 rounded-xl border hover:border-opacity-40 transition-all duration-300 text-center
                    ${darkMode
                      ? 'bg-secondary1/50 border-primary/20 hover:border-primary/40'
                      : 'bg-white/80 border-blue-200 hover:border-blue-300'}`}
                >
                  <div className={`text-3xl mb-4 transition-colors duration-300 ${darkMode ? 'text-primary' : 'text-blue-600'}`}>
                    {type.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {type.title}
                  </h3>
                  <p className={`transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                    {type.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Business Restrictions Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`mt-16 border rounded-xl p-6 md:p-8 transition-colors duration-300
              ${darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}
          >
            <div className="flex items-start gap-4">
              <FiAlertTriangle className="text-red-500 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('privacy.restrictions.title')}
                </h2>
                <p className={`transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  {t('privacy.restrictions.description')}
                </p>
                <ul className="mt-4 space-y-2">
                  {t('privacy.restrictions.examples', { returnObjects: true }).map((example, index) => (
                    <li key={index} className={`flex items-center gap-2 transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Data Usage Sections */}
          <div className="mt-16 space-y-12">
            {dataUsageSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`backdrop-blur-sm p-6 rounded-xl border transition-colors duration-300
                  ${darkMode
                    ? 'bg-secondary1/50 border-primary/20'
                    : 'bg-white/80 border-blue-200'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg text-xl transition-colors duration-300
                    ${darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'}`}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.points.map((point, idx) => (
                        <li key={idx} className={`flex items-start gap-2 transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mt-2 transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-blue-500'}`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Policy Updates Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`mt-16 border rounded-xl p-6 md:p-8 transition-colors duration-300
              ${darkMode ? 'bg-primary/5 border-primary/20' : 'bg-blue-50 border-blue-200'}`}
          >
            <h2 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.updates.title')}
            </h2>
            <p className={`mb-4 transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
              {t('privacy.updates.description')}
            </p>
            <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-500'}`}>
              {t('privacy.updates.lastUpdated', { date: new Date().toLocaleDateString() })}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Privacy
