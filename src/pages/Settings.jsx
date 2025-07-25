import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiBriefcase, FiSun, FiMoon } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { selectedBusiness } = useSelector(state => state.business);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Setting card data
  const settingCards = [
    {
      id: 'profile',
      title: t('settings.profile.title') || 'Profile Settings',
      description: t('settings.profile.description') || 'Manage your personal information',
      icon: <FiUser className="w-6 h-6" />,
      link: `/dashboard/profile/${user?.id || user?._id}`,
      color: 'from-primary to-secondary2',
    },
    {
      id: 'business',
      title: t('settings.business.title') || 'Business Settings',
      description: t('settings.business.description') || 'Manage your business details',
      icon: <FiBriefcase className="w-6 h-6" />,
      link: selectedBusiness ? `/dashboard/my-business/${selectedBusiness._id}` : '/dashboard/my-business',
      color: 'from-secondary2 to-primary',
    },
    {
      id: 'preferences',
      title: t('settings.preferences.title') || 'App Preferences',
      description: t('settings.preferences.description') || 'Customize your app experience',
      icon: darkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />,
      onClick: toggleDarkMode,
      isButton: true,
      color: 'from-blue-500 to-purple-500',
    }
  ];

  return (
    <div className={`min-h-screen ${
      darkMode
        ? 'bg-secondary1 text-gray-300'
        : 'bg-gray-50 text-gray-700'
    }`}>
      <div className="container mx-auto px-4 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('settings.title') || 'Settings'}
          </h1>
          <p className={`max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t('settings.subtitle') || 'Manage your account settings and preferences'}
          </p>
        </motion.div>

        {/* Settings Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {settingCards.map((card) => {
            const CardContent = (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`h-[200px] backdrop-blur-sm border rounded-xl overflow-hidden shadow-lg p-6 cursor-pointer transition-all flex flex-col ${
                  darkMode
                    ? 'bg-secondary1/50 border-primary/20 hover:bg-secondary1/70'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`bg-gradient-to-r ${card.color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
                  <div className="text-white">
                    {card.icon}
                  </div>
                </div>
                <div className="flex flex-col flex-grow justify-center">
                  <h3 className={`font-bold text-xl mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>{card.title}</h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{card.description}</p>
                </div>
                {card.isButton && (
                  <div className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="text-xs">
                      {darkMode
                        ? t('common.lightMode') || 'Switch to Light Mode'
                        : t('common.darkMode') || 'Switch to Dark Mode'
                      }
                    </span>
                  </div>
                )}
              </motion.div>
            );

            return card.isButton ? (
              <div key={card.id} className="h-full" onClick={card.onClick}>
                {CardContent}
              </div>
            ) : (
              <Link key={card.id} to={card.link} className="h-full">
                {CardContent}
              </Link>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mt-12 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <p>
            {t('settings.needHelp') || 'Need help with your settings?'}{' '}
            <a href="#" className="text-primary hover:underline">
              {t('settings.contactSupport') || 'Contact Support'}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
