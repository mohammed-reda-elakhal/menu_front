import React, { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)
  const { t } = useTranslation()

  return (
    <div className="bg-secondary1 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('faq.title.part1')} <span className="text-primary">{t('faq.title.part2')}</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {t('faq.questions', { returnObjects: true }).map((faq, index) => (
            <div key={index}>
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

                {activeIndex === index && (
                  <div className="mt-4 overflow-hidden">
                    <p className="text-gray_bg">{faq.answer}</p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ