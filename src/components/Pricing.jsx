import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

function Pricing() {
  const { t } = useTranslation()
  const { darkMode } = useTheme()

  const plans = [
    {
      key: 'free',
      popular: false
    },
    {
      key: 'premium',
      popular: true
    }
  ]

  return (
    <div className={`py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300
      ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300
            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('pricing.title.simple')} <span className="text-primary">{t('pricing.title.transparent')}</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300
            ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300
                ${plan.popular
                  ? 'border-primary'
                  : darkMode ? 'border-primary/20' : 'border-blue-200'}
                ${darkMode
                  ? 'bg-gradient-to-br from-secondary1 to-secondary1/95'
                  : 'bg-gradient-to-br from-white to-blue-50/80 shadow-md'}
                hover:border-primary/60`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                    {t(`pricing.plans.${plan.key}.popular`)}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300
                  ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t(`pricing.plans.${plan.key}.name`)}
                </h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {t(`pricing.plans.${plan.key}.price`)}
                  </span>
                  <span className={`ml-2 transition-colors duration-300
                    ${darkMode ? 'text-gray_bg' : 'text-gray-500'}`}>
                    {t('pricing.currency')}
                  </span>
                </div>
                <p className={`transition-colors duration-300
                  ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  {t(`pricing.plans.${plan.key}.description`)}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {t(`pricing.plans.${plan.key}.features`, { returnObjects: true }).map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-3 transition-colors duration-300
                    ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                    <FaCheck className="text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300
                  ${plan.popular
                    ? 'bg-primary hover:bg-secondary2 text-white'
                    : darkMode
                      ? 'bg-primary/10 hover:bg-primary/20 text-white'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
              >
                {t(`pricing.plans.${plan.key}.buttonText`)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing