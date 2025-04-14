import React from 'react'
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
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t('features.title.powerful')} <span className="text-primary">{t('features.title.features')}</span>
          </h2>
          <p className="text-gray_bg text-base sm:text-lg max-w-2xl mx-auto px-2">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden p-8 rounded-2xl border-2 border-primary/10
                bg-gradient-to-br from-secondary1 to-secondary1/95
                hover:border-primary/30"
            >
              <div className="absolute top-0 right-0 w-24 h-24
                bg-primary/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12">
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-primary text-4xl p-3 rounded-xl
                    bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {t(`features.items.${feature.key}.title`)}
                  </h3>
                </div>
                <p className="text-gray_bg pl-2 border-l-2 border-primary/20">
                  {t(`features.items.${feature.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features