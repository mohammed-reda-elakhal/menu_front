import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Single menu management',
      'Basic QR code generation',
      'Mobile responsive design',
      'Basic analytics',
      'Social media sharing'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '100',
    description: 'Best for growing restaurants',
    features: [
      'Multiple menu management',
      'Custom QR code design',
      'Advanced analytics dashboard',
      'Priority support',
      'Multi-language support',
      'Real-time menu updates',
      'Custom branding'
    ],
    buttonText: 'Start Premium',
    popular: true
  }
]

function Pricing() {
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
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your restaurant's needs
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
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray_bg ml-2">DH/month</span>
                </div>
                <p className="text-gray_bg">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
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
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing