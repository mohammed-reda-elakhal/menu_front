import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger for scroll-based animation
import { useTranslation } from 'react-i18next';

// Assuming you have these assets in your src/assets folder
import logo from '../assets/menu.png';
import aboutImage from '../assets/about2.jpeg'; // <--- NEW: You'll need to add an image here (e.g., a digital menu mockup)

import { MdUpdate } from 'react-icons/md';
import { BiDevices } from 'react-icons/bi';
import { IoShareSocialSharp } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function About() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const aboutRef = useRef(null); // Ref for the entire About section
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for elements that will be animated
      gsap.set(['.about-logo', '.about-intro > *', '.about-description-box', '.about-image', '.feature-card'], {
        opacity: 0,
        y: 40, // Start slightly below for a subtle rise-in effect
      });

      // Create a timeline for the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current, // The element that triggers the animation
          start: 'top 80%', // When the top of the section hits 80% down the viewport
          toggleActions: 'play none none none', // Play once when it enters, then do nothing
          // markers: true, // Uncomment for debugging scroll trigger behavior
        },
        defaults: { ease: 'power3.out', duration: 0.8 }, // Default ease and duration for all animations in this timeline
      });

      // Define the animation sequence
      tl.to('.about-logo', { opacity: 1, y: 0, duration: 0.7 })
        .to('.about-intro > *', { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 }, '-=0.4') // Stagger intro text, start a bit earlier
        .to('.about-description-box', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to('.about-image', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.1)' }, '-=0.2') // Pop in the image
        .to('.feature-card', { opacity: 1, y: 0, stagger: 0.2, duration: 0.6 }, '-=0.4'); // Stagger feature cards, start a bit earlier

      // Animation douce pour chaque card individuellement
      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: 0.3 + i * 0.18,
            ease: 'power3.out'
          }
        );
      });
    }, aboutRef); // GSAP context scope

    return () => ctx.revert(); // Clean up GSAP animations when the component unmounts
  }, []);

  return (
    <div ref={aboutRef} className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden
      ${darkMode ? 'bg-gradient-to-b from-secondary1 to-secondary1/90' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      {/* Modale de prévisualisation de l'image */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black/40 rounded-full px-2 py-0.5 hover:bg-black/70"
              onClick={() => setPreviewOpen(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
            <img
              src={aboutImage}
              alt="Preview Digital Menu"
              className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white"
              style={{ background: 'none' }}
            />
          </div>
        </div>
      )}

      {/* Subtle background circles for visual interest (similar to Hero section) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 -left-1/4 w-[350px] h-[350px] rounded-full blur-[60px] opacity-30
          ${darkMode ? 'bg-secondary2/10' : 'bg-blue-200/15'}`} />
        <div className={`absolute -bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[60px] opacity-30
          ${darkMode ? 'bg-primary/5' : 'bg-blue-100/20'}`} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10"> {/* Ensure content is above background elements */}
        {/* Logo Section */}
        <div className="about-logo flex justify-center mb-12">
          <img src={logo} alt="Meniwi Logo" className="h-16 w-auto" /> {/* Slightly larger logo */}
        </div>

        {/* Main Content (Title and Subtitle) */}
        <div className="text-center mb-16 about-intro">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 leading-tight
            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('about.title.transform')} <span className="text-primary block mt-2 md:inline-block md:mt-0">{t('about.title.experience')}</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-8 transition-colors duration-300 leading-relaxed
            ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('about.subtitle')}
          </p>

          {/* Description section */}
          <div className={`about-description-box max-w-4xl mx-auto p-8 md:p-12 rounded-xl border transition-colors duration-300
            ${darkMode ? 'bg-secondary2/5 border-secondary2/10 shadow-lg' : 'bg-white border-blue-100 shadow-md'}`}>
            <div className="flex flex-col md:flex-row items-center md:justify-center md:items-center gap-10">
              <img
                src={aboutImage}
                alt="Digital Menu Mockup"
                className="w-80 h-80 object-contain rounded-xl mb-6 md:mb-0 cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
                onClick={() => setPreviewOpen(true)}
                title="Agrandir l'image"
              />
              <p className={`text-base leading-relaxed transition-colors duration-300 text-center
                ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                <span className="text-primary font-semibold">{t('about.description.company')}</span>{' '}
                {t('about.description.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <div className={`feature-card group p-6 rounded-xl border transition-all duration-300
            ${darkMode ? 'bg-[#23243a] border-primary/10' : 'bg-white border-blue-100'}
            shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-1 cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center justify-center rounded-full p-2
                ${darkMode ? 'bg-primary/10' : 'bg-primary/10'}`}
              >
                <MdUpdate className="text-primary text-2xl" />
              </span>
              <h3 className="text-lg font-semibold text-primary">{t('about.features.realtime.title')}</h3>
            </div>
            <p className={`transition-colors duration-300 text-gray-600 dark:text-gray_bg text-sm`}>{t('about.features.realtime.description')}</p>
          </div>

          {/* Feature 2 */}
          <div className={`feature-card group p-6 rounded-xl border transition-all duration-300
            ${darkMode ? 'bg-[#23243a] border-primary/10' : 'bg-white border-blue-100'}
            shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-1 cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center justify-center rounded-full p-2
                ${darkMode ? 'bg-secondary2/10' : 'bg-secondary2/10'}`}
              >
                <BiDevices className="text-primary text-2xl" />
              </span>
              <h3 className="text-lg font-semibold text-primary">{t('about.features.interactive.title')}</h3>
            </div>
            <p className={`transition-colors duration-300 text-gray-600 dark:text-gray_bg text-sm`}>{t('about.features.interactive.description')}</p>
          </div>

          {/* Feature 3 */}
          <div className={`feature-card group p-6 rounded-xl border transition-all duration-300
            ${darkMode ? 'bg-[#23243a] border-primary/10' : 'bg-white border-blue-100'}
            shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-1 cursor-pointer`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center justify-center rounded-full p-2
                ${darkMode ? 'bg-blue-200/10' : 'bg-blue-200/10'}`}
              >
                <IoShareSocialSharp className="text-primary text-2xl" />
              </span>
              <h3 className="text-lg font-semibold text-primary">{t('about.features.sharing.title')}</h3>
            </div>
            <p className={`transition-colors duration-300 text-gray-600 dark:text-gray_bg text-sm`}>{t('about.features.sharing.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;