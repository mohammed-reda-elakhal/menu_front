import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
// Removed unused imports: HeroImage (not used), RiRestaurant2Line, RiCupLine, RiStore2Line, BiDish, BiQr, BiRestaurant, BiCoffee, BiMobile, FaRegLightbulb, FaToolbox, FaRegChartBar, RiCustomerService2Line
import { useTranslation } from 'react-i18next';
import { MdOutlineQrCode2 } from 'react-icons/md'; // Only this one is used for QR
import { IoRestaurantOutline } from 'react-icons/io5'; // Only this one is used for Menu
import { useTheme } from '../context/ThemeContext';

function Hero() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for elements that will be animated
      gsap.set(['.hero-text > *', '.qr-menu-container', '.hero-buttons > *'], {
        opacity: 0,
        y: 20, // Start slightly below
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero-text > *', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15, // Quicker stagger
      })
      .to('.qr-menu-container', {
        opacity: 1,
        y: 0,
        duration: 1, // Slightly longer for a smooth reveal
        ease: 'back.out(1.2)', // A bit of a bounce effect
      }, "-=0.4") // Start this animation slightly before the text finishes
      .to('.hero-buttons > *', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
      }, "-=0.5"); // Start buttons slightly before the main container finishes

      // The scan-line animation is removed for 'minimal animation'.
      // The 'scan-text' is now static below the QR code.

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className={`relative min-h-[75vh] overflow-hidden px-4 py-4 transition-colors duration-300
      ${darkMode
        ? 'bg-gradient-to-b from-secondary1 to-secondary1/95'
        : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      {/* Enhanced background effects - made less aggressive */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full blur-[70px] opacity-70
          ${darkMode ? 'bg-secondary2/10' : 'bg-blue-200/20'}`} /> {/* Reduced blur, removed pulse */}
        <div className={`absolute -bottom-24 -right-24 w-[350px] h-[350px] rounded-full blur-[70px] opacity-70
          ${darkMode ? 'bg-primary/5' : 'bg-blue-100/40'}`} /> {/* Reduced blur */}
      </div>

      <div className="max-w-5xl mx-auto pt-2 relative z-10"> {/* Added z-10 to ensure content is above background */}
        {/* Compact hero content */}
        <div className="hero-text text-center space-y-4 mb-8">
          <div className={`inline-block px-3 py-1 rounded-full text-xs
            ${darkMode
              ? 'bg-secondary2/10 text-secondary2'
              : 'bg-blue-100 text-blue-600'}`}>
            🍔🍷 Transform Your Menu Experience
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold leading-tight
            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('hero.title.part1')}
            <span className="text-primary block mt-2">{t('hero.title.part2')}</span>
          </h1>
          <p className={`text-base md:text-lg max-w-xl mx-auto leading-relaxed
            ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('hero.description')}
          </p>
        </div>

        {/* Compact QR and Menu Container - now a single animated unit */}
        <div className={`qr-menu-container relative max-w-[700px] mx-auto rounded-xl p-6 backdrop-blur-sm
          border transition-colors duration-300 shadow-xl
          ${darkMode
            ? 'bg-secondary2/5 border-secondary2/10 shadow-[0_0_40px_rgba(0,0,0,0.2)]' // Slightly stronger shadow for impact
            : 'bg-white/80 border-blue-100 shadow-[0_0_40px_rgba(59,130,246,0.15)]'}`}>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            {/* QR Code */}
            <div className={`relative w-[200px] aspect-square
              rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300
              ${darkMode
                ? 'bg-secondary2/10 border-secondary2/20 shadow-[0_0_15px_rgba(var(--secondary2),0.3)]'
                : 'bg-blue-50 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]'}`}>
              <MdOutlineQrCode2 className={`w-full h-full ${darkMode ? 'text-secondary2' : 'text-blue-500'}`} />
              {/* Removed scan-line */}
              <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
                font-medium text-xs
                ${darkMode ? 'text-secondary2' : 'text-blue-600'}`}>
                Scan to View
              </div>
            </div>

            {/* Responsive Connecting Row - simplified */}
            <div className="flex md:flex-row flex-col items-center gap-2">
              <div className={`w-0.5 h-16 md:w-16 md:h-0.5 rounded-full transition-colors duration-300
                ${darkMode
                  ? 'bg-gradient-to-b md:bg-gradient-to-r from-secondary2/80 to-secondary2/60'
                  : 'bg-gradient-to-b md:bg-gradient-to-r from-blue-400/80 to-blue-300/60'}`} />
              <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-300
                ${darkMode ? 'bg-secondary2/60' : 'bg-blue-400/60'}`} />
            </div>

            {/* Compact Menu Preview */}
            <div className={`w-[200px] aspect-[3/4]
              rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300
              ${darkMode
                ? 'bg-secondary2/5 border-secondary2/20 shadow-[0_0_20px_rgba(var(--secondary2),0.2)]'
                : 'bg-white border-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.1)]'}`}>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <IoRestaurantOutline className={`text-xl ${darkMode ? 'text-secondary2' : 'text-blue-500'}`} />
                  <span className={`font-medium text-sm
                    ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Digital Menu</span>
                </div>
                {/* Menu Items Preview */}
                <div className="flex-1 space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item}
                      className={`flex items-center gap-2 p-2 rounded-lg
                        border transition-colors duration-300
                        ${darkMode
                          ? 'bg-secondary1/40 border-secondary2/10'
                          : 'bg-blue-50/80 border-blue-100'}`}>
                      <div className={`w-8 h-8 rounded-md animate-pulse transition-colors duration-300
                        ${darkMode ? 'bg-secondary2/20' : 'bg-blue-200/50'}`} />
                      <div className="flex-1">
                        <div className={`h-2 w-16 rounded animate-pulse transition-colors duration-300
                          ${darkMode ? 'bg-secondary2/20' : 'bg-blue-200/70'}`} />
                        <div className={`h-2 w-10 rounded mt-1 animate-pulse transition-colors duration-300
                          ${darkMode ? 'bg-secondary2/10' : 'bg-blue-100/70'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact buttons - now a single animated unit */}
        <div className="hero-buttons mt-8 flex flex-wrap gap-3 justify-center">
          <button className={`group px-5 py-2 rounded-lg text-sm font-medium
            transition-all duration-300 hover:shadow-lg hover:scale-105
            flex items-center gap-2
            ${darkMode
              ? 'bg-secondary2 text-white hover:shadow-secondary2/25'
              : 'bg-blue-500 text-white hover:shadow-blue-500/25'}`}>
            {t('hero.buttons.getStarted')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button className={`px-5 py-2 rounded-lg text-sm font-medium
            transition-all duration-300 border backdrop-blur-sm
            ${darkMode
              ? 'bg-white/5 text-white hover:bg-white/10 border-white/10'
              : 'bg-white/80 text-gray-700 hover:bg-white border-blue-200'}`}>
            {t('hero.buttons.viewDemo')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;