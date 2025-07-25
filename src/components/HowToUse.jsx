import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { FaUserPlus, FaPencilAlt, FaPalette, FaQrcode } from 'react-icons/fa';
import { FiZap, FiArrowRight } from 'react-icons/fi';

// Define step configurations
const stepDetails = {
  create_account: { icon: FaUserPlus, colorKey: 'primary' },
  create_menu: { icon: FaPencilAlt, colorKey: 'secondary2' },
  select_template: { icon: FaPalette, colorKey: 'primary2' },
  done: { icon: FaQrcode, colorKey: 'primary' }
};

const stepKeys = ['create_account', 'create_menu', 'select_template', 'done'];

function HowToUse() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  // Fallbacks for CTA
  const ctaText = t('howToUse.cta') || 'Start Free Trial';
  const ctaSubtext = t('howToUse.ctaSubtext') || 'No credit card required';

  return (
    <section className={`py-16 px-4 transition-colors duration-500 ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="relative mb-12">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative inline-block p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border border-primary/20 backdrop-blur-sm">
              <FiZap className="text-2xl text-primary animate-bounce-subtle" />
      </div>
          </div>
          <h2 className={`text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent animate-gradient-x`}>
            {t('howToUse.title')}
            <span className="relative inline-block ml-2">
              <span className="relative z-10">{t('howToUse.highlight')}</span>
              <span className="absolute inset-0 bg-primary/20 blur-md transform -skew-x-12 animate-pulse-slow" />
            </span>
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>{t('howToUse.subtitle')}</p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {stepKeys.map((stepKey, index) => {
            const step = stepDetails[stepKey];
            const IconComponent = step.icon;
            const isLast = index === stepKeys.length - 1;
            return (
              <div key={stepKey} className="relative group flex flex-col items-center">
                {/* Arrow between steps */}
                {!isLast && (
                  <div className={`hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-2xl ${darkMode ? 'text-primary/60' : 'text-primary/80'}`}>→</div>
                )}
                {/* Step Card */}
                <div className={`relative w-full h-full p-7 rounded-2xl border transition-all duration-300 flex flex-col items-center
                  ${darkMode ? 'bg-[#18192a] border-primary/20' : 'bg-white border-primary/20'}
                  shadow-md hover:shadow-xl hover:-translate-y-1`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4
                    ${darkMode ? 'bg-primary/10' : 'bg-primary/10'} border border-primary/20`}
                  >
                    <IconComponent className={`w-7 h-7 ${darkMode ? 'text-primary' : 'text-primary'}`} />
                  </div>
                  {/* Step number */}
                  <div className={`text-xs font-semibold mb-1 tracking-wider ${darkMode ? 'text-primary/80' : 'text-primary/80'}`}>Step {index + 1}</div>
                  {/* Title */}
                  <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t(`howToUse.steps.${stepKey}.title`)}</h3>
                  {/* Description */}
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t(`howToUse.steps.${stepKey}.description`)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-8">
          <button className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}>{ctaText}</button>
          <p className={`text-xs mt-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>{ctaSubtext}</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HowToUse;