import React from 'react'
import { motion } from 'framer-motion'
import { FaPalette, FaQrcode, FaMobileAlt, FaChartLine } from 'react-icons/fa'
import { MdLanguage, MdNotifications } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

const features = [
  {
    icon: <FaPalette />,
    key: 'design'
  },
  {
    icon: <FaQrcode />,
    key: 'qr'
  },
  {
    icon: <FaMobileAlt />,
    key: 'mobile'
  },
  {
    icon: <FaChartLine />,
    key: 'analytics'
  },
  {
    icon: <MdLanguage />,
    key: 'language'
  },
  {
    icon: <MdNotifications />,
    key: 'updates'
  }
]

function Features() {
  const { t } = useTranslation()

  return (
    <div className="bg-secondary1 py-12 sm:py-24 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t('features.title.powerful')} <span className="text-primary">{t('features.title.features')}</span>
          </h2>
          <p className="text-gray_bg text-base sm:text-lg max-w-2xl mx-auto px-2">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(55, 104, 229, 0.1)",
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden p-8 rounded-2xl border-2 border-primary/10 
                bg-gradient-to-br from-secondary1 to-secondary1/95
                hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 
                bg-primary/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12 
                group-hover:bg-primary/20 transition-all duration-500">
              </div>
              
              <motion.div 
                className="relative z-10"
                whileHover={{ scale: 1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-primary text-4xl p-3 rounded-xl 
                    bg-primary/10 group-hover:bg-primary/20 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white 
                    group-hover:text-primary transition-colors duration-300">
                    {t(`features.items.${feature.key}.title`)}
                  </h3>
                </div>
                <p className="text-gray_bg pl-2 border-l-2 border-primary/20 
                  group-hover:border-primary/40 transition-all duration-300">
                  {t(`features.items.${feature.key}.description`)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Features