import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import logo from '../assets/menu.png'
import { MdUpdate } from 'react-icons/md'
import { BiDevices } from 'react-icons/bi'
import { IoShareSocialSharp } from 'react-icons/io5'

function About() {
  const { t } = useTranslation()

  return (
    <div className="bg-secondary1 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-12"
      >
        <img src={logo} alt="Menuso Logo" className="h-12 w-auto" />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('about.title.transform')} <span className="text-primary">{t('about.title.experience')}</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto mb-8">
            {t('about.subtitle')}
          </p>
          
          {/* Description section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto bg-primary/5 p-6 rounded-xl border border-primary/10"
          >
            <p className="text-gray_bg text-md leading-relaxed">
              <span className="text-primary font-semibold">{t('about.description.company')}</span>{' '}
              {t('about.description.text')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <MdUpdate className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">{t('about.features.realtime.title')}</h3>
            </div>
            <p className="text-gray_bg">{t('about.features.realtime.description')}</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <BiDevices className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">{t('about.features.interactive.title')}</h3>
            </div>
            <p className="text-gray_bg">{t('about.features.interactive.description')}</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <IoShareSocialSharp className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">{t('about.features.sharing.title')}</h3>
            </div>
            <p className="text-gray_bg">{t('about.features.sharing.description')}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default About