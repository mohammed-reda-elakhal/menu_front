import React, { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)
  const { t } = useTranslation()
  const { darkMode } = useTheme()

  return (
    <div className={`py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300
      ${darkMode ? 'bg-secondary1' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300
            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('faq.title.part1')} <span className="text-primary">{t('faq.title.part2')}</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300
            ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {t('faq.questions', { returnObjects: true }).map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-300
                  ${darkMode
                    ? 'bg-secondary1 border-primary/20 hover:border-primary/40'
                    : 'bg-white border-blue-100 hover:border-blue-200 shadow-sm hover:shadow'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <h3 className={`text-lg font-semibold transition-colors duration-300
                    ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {faq.question}
                  </h3>
                  <div className="text-primary ml-4">
                    {activeIndex === index ? <FiMinus size={20} /> : <FiPlus size={20} />}
                  </div>
                </div>

                {activeIndex === index && (
                  <div className="mt-4 overflow-hidden">
                    <p className={`transition-colors duration-300
                      ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                      {faq.answer}
                    </p>
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