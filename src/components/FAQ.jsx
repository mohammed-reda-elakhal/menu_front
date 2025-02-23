import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiMinus } from 'react-icons/fi'

const faqs = [
  {
    question: "How do I create my digital menu?",
    answer: "Creating your digital menu is simple. After signing up, you can easily add categories, items, prices, and descriptions through our intuitive dashboard. Upload images, customize layouts, and your menu will be ready to share in minutes."
  },
  {
    question: "Can I update my menu in real-time?",
    answer: "Yes! You can update your menu anytime through our dashboard. Changes are reflected instantly across all platforms where your menu is shared, including QR codes and social media links."
  },
  {
    question: "How does the QR code system work?",
    answer: "Each menu gets a unique QR code that you can print and display in your restaurant. When customers scan the code with their smartphone, they'll see your latest menu instantly in their browser - no app download required."
  },
  {
    question: "Is the platform mobile-friendly?",
    answer: "Absolutely! Our menus are fully responsive and optimized for all devices - smartphones, tablets, and desktop computers. Your customers will enjoy a seamless experience regardless of their device."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, debit cards, and digital payment methods. All payments are processed securely through our trusted payment gateway partners."
  }
]

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <div className="bg-secondary1 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            Everything you need to know about Menuso and how it works
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-lg bg-secondary1 border-2 border-primary/20 
                  hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <div className="text-primary ml-4">
                    {activeIndex === index ? <FiMinus size={20} /> : <FiPlus size={20} />}
                  </div>
                </div>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <p className="text-gray_bg">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ