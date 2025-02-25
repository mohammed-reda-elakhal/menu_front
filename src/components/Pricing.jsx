import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

function Pricing() {
  const { t } = useTranslation()

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
    <div className="bg-secondary1 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('pricing.title.simple')} <span className="text-primary">{t('pricing.title.transparent')}</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative p-8 rounded-2xl border-2 
                ${plan.popular ? 'border-primary' : 'border-primary/20'}
                bg-gradient-to-br from-secondary1 to-secondary1/95
                hover:border-primary/60 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                    {t(`pricing.plans.${plan.key}.popular`)}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t(`pricing.plans.${plan.key}.name`)}
                </h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {t(`pricing.plans.${plan.key}.price`)}
                  </span>
                  <span className="text-gray_bg ml-2">{t('pricing.currency')}</span>
                </div>
                <p className="text-gray_bg">{t(`pricing.plans.${plan.key}.description`)}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {t(`pricing.plans.${plan.key}.features`, { returnObjects: true }).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray_bg">
                    <FaCheck className="text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300
                  ${plan.popular 
                    ? 'bg-primary hover:bg-secondary2 text-white' 
                    : 'bg-primary/10 hover:bg-primary/20 text-white'}`}
              >
                {t(`pricing.plans.${plan.key}.buttonText`)}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing