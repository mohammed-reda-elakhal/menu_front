import React, { useEffect } from 'react'
import { FaPalette, FaQrcode, FaMobileAlt, FaChartLine } from 'react-icons/fa'
import { MdLanguage, MdNotifications } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

const featuresData = [
  { icon: <FaPalette />, key: 'design' },
  { icon: <FaQrcode />, key: 'qr' },
  { icon: <FaMobileAlt />, key: 'mobile' },
  { icon: <FaChartLine />, key: 'analytics' },
  { icon: <MdLanguage />, key: 'language' },
  { icon: <MdNotifications />, key: 'updates' }
]

const foodEmojis = ['🍕', '🍔', '🍣', '☕', '🍰', '🍜', '🍩', '🥗', '🍟', '🍦', '🍷', '🥤']

function Features() {
  const { t } = useTranslation()
  const { darkMode } = useTheme()

  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-active');
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500
      relative overflow-hidden ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      {/* Floating food emojis for decoration */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {foodEmojis.map((emoji, idx) => (
          <div
            key={idx}
            className="absolute animate-float-food"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 80}%`,
              fontSize: `${Math.random() * 18 + 18}px`,
              opacity: darkMode ? 0.13 : 0.09,
              filter: darkMode ? 'grayscale(0.2)' : 'grayscale(0.4)'
            }}
          >
            {emoji}
          </div>
        ))}
        {/* Optional: subtle dotted pattern */}
        <div className={`absolute inset-0 ${darkMode ? 'opacity-10' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `radial-gradient(circle at center, ${darkMode ? '#fff' : '#6366F1'} 1px, transparent 1px)`,
            backgroundSize: '22px 22px'
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <h2
            className={`animate-on-scroll opacity-0 transform translate-y-8
              text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 transition-all duration-700
              ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('features.title.powerful')} <span className="text-primary">{t('features.title.features')}</span>
          </h2>
          <p
            className={`animate-on-scroll opacity-0 transform translate-y-8 delay-200
              text-md sm:text-lg max-w-3xl mx-auto px-2 transition-all duration-700
              ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}
          >
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {featuresData.map((feature, index) => (
            <div
              key={feature.key}
              className={`animate-on-scroll opacity-0 transform translate-y-8
                group relative p-7 rounded-xl border transition-all duration-500 ease-out
                ${darkMode ? 'bg-[#18192a] border-primary/10' : 'bg-white border-primary/10'}
                shadow-sm hover:shadow-md hover:-translate-y-2 hover:scale-[1.03] cursor-pointer`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                  ${darkMode ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-primary'}`}
                >
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-bold transition-colors duration-300 group-hover:text-primary ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t(`features.items.${feature.key}.title`)}</h3>
              </div>
              <p className={`text-base leading-relaxed transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t(`features.items.${feature.key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .animate-on-scroll {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes float-food {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-18px) rotate(6deg); }
        }
        .animate-float-food {
          animation: float-food 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Features