import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessById } from '../redux/apiCalls/businessApiCalls';
import { getMenusByBusiness } from '../redux/apiCalls/menuApiCalls';
import { getProduitsByMenu, getBestProductsByBusiness } from '../redux/apiCalls/produitApiCalls';
import { resetBusinessState } from '../redux/Slice/businessSlice';
import { resetMenuState } from '../redux/Slice/menuSlice';
import { resetProduitState } from '../redux/Slice/produitSlice';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import BusinessRating from '../components/BusinessRating';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/SwiperEnhancements.css';
import FloatingColorPaletteSelector from '../components/FloatingColorPaletteSelector';
import {
  FiHome,
  FiAlertCircle,
  FiInfo,
  FiPhone,
  FiMapPin,
  FiStar,
  FiMenu,
  FiCoffee,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiSun,
  FiMoon,
  FiExternalLink,
  FiMail
} from 'react-icons/fi';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaPinterest,
  FaSnapchat,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';


const BusinessProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { currentBusiness, loading, error } = useSelector(state => state.business);
  const { menusByBusiness } = useSelector(state => state.menu);
  const { bestProducts, bestProductsLoading, bestProductsError } = useSelector(state => state.produit);

  // Navigation state
  const [activeSection, setActiveSection] = useState('about');

  // Section refs for scroll functionality
  const aboutRef = useRef(null);
  const bestProductsRef = useRef(null);
  const hoursRef = useRef(null);
  const contactRef = useRef(null);

  // Create cleanup function to reset all business-related state
  // This ensures fresh data loading and prevents contamination between different business profiles
  const cleanupBusinessState = useCallback(() => {
    dispatch(resetBusinessState());
    dispatch(resetMenuState());
    dispatch(resetProduitState());
  }, [dispatch]);

  // Main effect for loading business data with cleanup on ID change
  // This handles: component unmount, navigation to different business profile, direct URL changes
  useEffect(() => {
    if (id) {
      dispatch(getBusinessById(id));
    }

    // Cleanup function that runs when component unmounts or business ID changes
    // This ensures state is reset when navigating away or to a different business
    return () => {
      cleanupBusinessState();
    };
  }, [dispatch, id, cleanupBusinessState]);

  // Handle browser navigation events for additional cleanup
  // This covers: browser back/forward buttons, page refresh, tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupBusinessState();
    };

    const handlePopState = () => {
      // Small delay to allow navigation to complete before cleanup
      setTimeout(() => {
        cleanupBusinessState();
      }, 100);
    };

    // Add event listeners for browser navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [cleanupBusinessState]);

  // Fetch menus and best products when business is loaded
  useEffect(() => {
    if (currentBusiness?._id) {
      dispatch(getMenusByBusiness(currentBusiness._id));
      // Fetch best products for this business
      dispatch(getBestProductsByBusiness(currentBusiness._id));
    }
  }, [dispatch, currentBusiness?._id]);

  // Fetch products when menus are loaded (keeping for other parts of the app)
  useEffect(() => {
    if (menusByBusiness?.menus && menusByBusiness.menus.length > 0) {
      const firstMenu = menusByBusiness.menus[0];
      if (firstMenu?._id) {
        dispatch(getProduitsByMenu(firstMenu._id));
      }
    }
  }, [dispatch, menusByBusiness?.menus]);

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'bestProducts', ref: bestProductsRef },
        { id: 'hours', ref: hoursRef },
        { id: 'contact', ref: contactRef }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentBusiness]); // Re-run when business data loads

  // Days of the week for operating hours
  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  // Format time to 24h format (no conversion)
  const formatTime = (time) => {
    if (!time) return '';
    try {
      // Return the time as is in 24-hour format
      return time;
    } catch (error) {
      return time;
    }
  };

  // Check if business is currently open
  const isCurrentlyOpen = () => {
    if (!currentBusiness?.operatingHours) return false;

    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    const todayHours = currentBusiness.operatingHours[currentDay];
    if (!todayHours || todayHours.closed) return false;

    try {
      const [openHour, openMin] = todayHours.open.split(':').map(Number);
      const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      // Handle overnight hours (e.g., 22:00 - 02:00)
      if (closeTime < openTime) {
        return currentTime >= openTime || currentTime <= closeTime;
      }

      return currentTime >= openTime && currentTime <= closeTime;
    } catch (error) {
      return false;
    }
  };

  // Get next opening time
  const getNextOpeningTime = () => {
    if (!currentBusiness?.operatingHours) return null;

    const now = new Date();
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Check today first, then next 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const dayName = daysOrder[checkDate.getDay()];
      const dayHours = currentBusiness.operatingHours[dayName];

      if (dayHours && !dayHours.closed) {
        if (i === 0) {
          // Today - check if still time to open
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const [openHour, openMin] = dayHours.open.split(':').map(Number);
          const openTime = openHour * 60 + openMin;

          if (currentTime < openTime) {
            return { day: 'Today', time: formatTime(dayHours.open) };
          }
        } else {
          const dayLabel = i === 1 ? 'Tomorrow' : daysOrder[checkDate.getDay()];
          return { day: dayLabel, time: formatTime(dayHours.open) };
        }
      }
    }

    return null;
  };

  // Get business phone number for calling
  const getBusinessPhone = () => {
    return currentBusiness?.phone ||
           currentBusiness?.socialMedia?.phone ||
           currentBusiness?.socialMedia?.whatsapp ||
           null;
  };

  // Format phone number for tel: protocol
  const formatPhoneForCall = (phone) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    return `tel:${cleanPhone}`;
  };

  // Generate appropriate link for social media platforms
  const generateSocialMediaLink = (platform, value) => {
    if (!value) return '';

    switch (platform) {
      case 'facebook':
        return value.startsWith('http') ? value : `https://facebook.com/${value}`;
      case 'instagram':
        return value.startsWith('http') ? value : `https://instagram.com/${value}`;
      case 'linkedin':
        return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
      case 'whatsapp':
        const whatsappNumber = value.replace('+', '');
        return `https://wa.me/${whatsappNumber}`;
      case 'telegram':
        const telegramNumber = value.replace('+', '');
        return `https://t.me/${telegramNumber}`;
      default:
        return value.startsWith('http') ? value : `https://${value}`;
    }
  };

  // Navigation functionality
  const scrollToSection = (sectionId) => {
    const refs = {
      about: aboutRef,
      bestProducts: bestProductsRef,
      hours: hoursRef,
      contact: contactRef
    };

    const targetRef = refs[sectionId];
    if (targetRef?.current) {
      const headerOffset = 100; // Account for sticky header
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Reset active section to about when scrolling to top
    setActiveSection('about');
  };

  // Dynamic color helper function
  const getThemeColors = () => {
    return {
      // Primary colors
      primary: `var(--color-primary, ${darkMode ? '#818cf8' : '#3768e5'})`,
      primaryHover: `var(--color-primaryHover, ${darkMode ? '#6366f1' : '#2855c7'})`,
      primaryLight: `var(--color-primaryLight, ${darkMode ? '#a5b4fc' : '#6e8fec'})`,

      // Secondary colors
      secondary: `var(--color-secondary, ${darkMode ? '#6366f1' : '#757de8'})`,
      accent: `var(--color-accent, ${darkMode ? '#fbbf24' : '#d97706'})`,
      accentHover: `var(--color-accentHover, ${darkMode ? '#f59e0b' : '#b45309'})`,

      // Background colors
      background: `var(--color-background, ${darkMode ? '#111827' : '#f9fafb'})`,
      backgroundSecondary: `var(--color-backgroundSecondary, ${darkMode ? '#1f2937' : '#ffffff'})`,
      backgroundTertiary: `var(--color-backgroundTertiary, ${darkMode ? '#374151' : '#f3f4f6'})`,

      // Text colors
      text: `var(--color-text, ${darkMode ? '#f9fafb' : '#1f2937'})`,
      textSecondary: `var(--color-textSecondary, ${darkMode ? '#e5e7eb' : '#4b5563'})`,
      textMuted: `var(--color-textMuted, ${darkMode ? '#9ca3af' : '#6b7280'})`,

      // Border colors
      border: `var(--color-border, ${darkMode ? '#374151' : '#e5e7eb'})`,
      borderHover: `var(--color-borderHover, ${darkMode ? '#4b5563' : '#d1d5db'})`,

      // Status colors
      success: `var(--color-success, ${darkMode ? '#34d399' : '#10b981'})`,
      warning: `var(--color-warning, ${darkMode ? '#fbbf24' : '#f59e0b'})`,
      error: `var(--color-error, ${darkMode ? '#f87171' : '#ef4444'})`,
      info: `var(--color-info, ${darkMode ? '#60a5fa' : '#3b82f6'})`
    };
  };

  const themeColors = getThemeColors();

  // Navigation items configuration
  const navigationItems = [
    {
      id: 'about',
      label: t('businessProfile.navigation.about'),
      icon: FiUser,
      ref: aboutRef
    },
    {
      id: 'bestProducts',
      label: t('businessProfile.navigation.bestProducts'),
      icon: FiStar,
      ref: bestProductsRef
    },
    {
      id: 'hours',
      label: t('businessProfile.navigation.hours'),
      icon: FiClock,
      ref: hoursRef
    },
    {
      id: 'contact',
      label: t('businessProfile.navigation.contact'),
      icon: FiPhone,
      ref: contactRef
    }
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: themeColors.background }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: themeColors.background }}
      >
        <div
          className="text-center p-6 rounded-xl shadow-lg"
          style={{
            backgroundColor: themeColors.backgroundSecondary,
            borderColor: themeColors.border,
            border: `1px solid ${themeColors.border}`
          }}
        >
          <div>
            <FiAlertCircle
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: themeColors.error }}
            />
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: themeColors.text }}
            >
              Error
            </h2>
            <p
              className="mb-6"
              style={{ color: themeColors.textSecondary }}
            >
              {error}
            </p>
            <Link
              to="/"
              className="px-6 py-2 rounded-lg shadow-md transition-colors duration-300"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.backgroundSecondary
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = themeColors.primary;
              }}
            >
              <FiHome className="inline mr-2" /> {t('businessProfile.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: themeColors.background }}
      >
        <div
          className="text-center p-6 rounded-xl shadow-lg"
          style={{
            backgroundColor: themeColors.backgroundSecondary,
            borderColor: themeColors.border,
            border: `1px solid ${themeColors.border}`
          }}
        >
          <div>
            <FiInfo
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: themeColors.primary }}
            />
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: themeColors.text }}
            >
              No Business Found
            </h2>
            <p
              className="mb-6"
              style={{ color: themeColors.textSecondary }}
            >
              Please check the business ID and try again.
            </p>
            <Link
              to="/"
              className="px-6 py-2 rounded-lg shadow-md transition-colors duration-300"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.backgroundSecondary
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = themeColors.primary;
              }}
            >
              <FiHome className="inline mr-2" /> {t('businessProfile.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }







  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Color Palette Selector */}
      <FloatingColorPaletteSelector />

      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm shadow-sm"
        style={{ backgroundColor: `${themeColors.backgroundSecondary}e6` }} // 90% opacity
      >
        <div className="container mx-auto px-4 py-4">
          {/* Top row with logo and status */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Scroll to top"
            >
              {currentBusiness?.logo?.url ? (
                <img
                  src={currentBusiness.logo.url}
                  alt={currentBusiness?.nom}
                  className="h-8 w-8 rounded-full object-cover transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    boxShadow: `0 0 0 2px transparent`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${themeColors.primary}40, 0 4px 12px ${themeColors.primary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px transparent';
                  }}
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
                  style={{
                    backgroundColor: `${themeColors.accent}20`,
                    boxShadow: `0 0 0 2px transparent`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `${themeColors.accent}30`;
                    e.target.style.boxShadow = `0 0 0 2px ${themeColors.accent}40, 0 4px 12px ${themeColors.accent}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = `${themeColors.accent}20`;
                    e.target.style.boxShadow = '0 0 0 2px transparent';
                  }}
                >
                  <FiCoffee
                    className="h-5 w-5"
                    style={{ color: themeColors.accent }}
                  />
                </div>
              )}
              <h1
                className="text-2xl font-bold transition-colors duration-300"
                style={{ color: themeColors.text }}
                onMouseEnter={(e) => {
                  e.target.style.color = themeColors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = themeColors.text;
                }}
              >
                {currentBusiness?.nom || 'Business'}
              </h1>
            </motion.button>
            <div className="flex items-center space-x-4">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: currentBusiness?.isOpen
                    ? `${themeColors.success}20`
                    : `${themeColors.error}20`,
                  color: currentBusiness?.isOpen
                    ? themeColors.success
                    : themeColors.error
                }}
              >
                {currentBusiness?.isOpen ? t('businessProfile.openNow') : t('businessProfile.closed')}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex justify-center">
            <div
              className="flex items-center rounded-2xl p-1 border"
              style={{
                backgroundColor: `${themeColors.backgroundTertiary}80`, // 50% opacity
                borderColor: themeColors.border
              }}
            >
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? themeColors.primary : 'transparent',
                      color: isActive ? themeColors.backgroundSecondary : themeColors.textSecondary,
                      boxShadow: isActive ? `0 10px 25px ${themeColors.primary}40` : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = `${themeColors.backgroundTertiary}80`;
                        e.target.style.color = themeColors.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = themeColors.textSecondary;
                      }
                    }}
                  >
                    {/* Mobile: Icon only */}
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />

                    {/* Desktop: Icon + Text */}
                    <span className="hidden md:inline text-sm font-medium">
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          backgroundColor: themeColors.primary,
                          zIndex: -1
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-24 px-4 min-h-[75vh] flex items-center mb-8"
        style={{
          backgroundImage: currentBusiness?.coverImage?.url
            ? `url(${currentBusiness.coverImage.url})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: currentBusiness?.coverImage?.url
              ? 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.3))'
              : `linear-gradient(135deg, ${themeColors.background}, ${themeColors.backgroundTertiary})`
          }}
        ></div>

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">


            {/* Business Name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter uppercase"
              style={{
                fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif",
                textShadow: currentBusiness?.coverImage?.url ? '3px 6px 12px rgba(0,0,0,0.4)' : 'none',
                lineHeight: '0.85',
                letterSpacing: '-0.02em',
                fontWeight: '900',
                fontStyle: 'italic',
                color: currentBusiness?.coverImage?.url ? '#ffffff' : themeColors.text
              }}
            >
              {currentBusiness?.nom || 'Business Name'}
            </motion.h2>

            {/* Bio Section in Hero */}
            {currentBusiness?.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-4xl mx-auto mb-10"
              >
                <p
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-light tracking-wide italic"
                  style={{
                    fontFamily: "'Crimson Text', 'Libre Baskerville', 'Times New Roman', serif",
                    textShadow: currentBusiness?.coverImage?.url ? '2px 3px 6px rgba(0,0,0,0.3)' : 'none',
                    lineHeight: '1.5',
                    letterSpacing: '0.01em',
                    fontWeight: '300',
                    color: currentBusiness?.coverImage?.url
                      ? '#f3f4f6'
                      : themeColors.textSecondary
                  }}
                >
                  {currentBusiness.bio}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              {currentBusiness?.menu_code && (
              <Link
                to={`/menu/${currentBusiness.menu_code}`}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 w-max"
                style={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.backgroundSecondary
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = themeColors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = themeColors.primary;
                }}
              >
                <FiMenu className="h-4 w-4 mr-2" />
                View Menu
              </Link>
            )}
            </motion.div>
          </div>
        </div>

        {/* Curved Border Design */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-20">
          <svg
            className="relative block w-full h-16 md:h-20 lg:h-24"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={themeColors.background}
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor={themeColors.backgroundSecondary}
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>
            <path
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1200,160,1248,128,1296,112L1344,96L1344,320L1296,320C1248,320,1152,320,1056,320C960,320,864,320,768,320C672,320,576,320,480,320C384,320,288,320,192,320C96,320,48,320,24,320L0,320Z"
              fill="url(#curveGradient)"
              className="transition-all duration-300"
            />
            {/* Secondary wave for depth */}
            <path
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1200,128,1248,96,1296,80L1344,64L1344,320L1296,320C1248,320,1152,320,1056,320C960,320,864,320,768,320C672,320,576,320,480,320C384,320,288,320,192,320C96,320,48,320,24,320L0,320Z"
              fill={themeColors.backgroundTertiary}
              fillOpacity="0.3"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 px-4 mt-8"
        style={{ backgroundColor: `${themeColors.backgroundTertiary}30` }} // 30% opacity
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* About Header with Logo */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {currentBusiness?.logo?.url ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative flex-shrink-0"
                  >
                    <img
                      src={currentBusiness.logo.url}
                      alt={`${currentBusiness?.nom} Logo`}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg ring-4"
                      style={{
                        ringColor: themeColors.border
                      }}
                    />
                    {/* Subtle glow effect */}
                    <div
                      className="absolute inset-0 rounded-full blur-md -z-10"
                      style={{ backgroundColor: `${themeColors.accent}10` }} // 10% opacity
                    ></div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg ring-4"
                    style={{
                      backgroundColor: themeColors.backgroundTertiary,
                      ringColor: themeColors.border
                    }}
                  >
                    <FiCoffee
                      className="w-10 h-10 md:w-12 md:h-12"
                      style={{ color: themeColors.accent }}
                    />
                  </motion.div>
                )}
                <div className="text-left">
                  <h2
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color: themeColors.text }}
                  >
                    About
                  </h2>
                  <h3
                    className="text-2xl md:text-3xl font-semibold mt-1"
                    style={{ color: themeColors.accent }}
                  >
                    {currentBusiness?.nom || 'Our Business'}
                  </h3>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto"
                style={{ color: themeColors.textSecondary }}
              >
                {currentBusiness?.description ||
                  'Where every cup is a journey to bliss. We specialize in premium, ethically-sourced coffee that delivers rich flavors, smooth finishes, and the perfect pick-me-up. Brew your perfect moment with us!'
                }
              </motion.p>

              {/* Rating Display */}
              {currentBusiness?.ratings && currentBusiness.ratings.total > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center justify-center space-x-4 mb-6"
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`h-6 w-6 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span
                      className="ml-3 text-lg font-medium"
                      style={{ color: themeColors.textSecondary }}
                    >
                      ({currentBusiness.ratings.total} {currentBusiness.ratings.total === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Tags */}
              {currentBusiness?.tags && currentBusiness.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {currentBusiness.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: `${themeColors.accent}20`, // 20% opacity
                        color: themeColors.accent
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = `${themeColors.accent}30`; // 30% opacity on hover
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = `${themeColors.accent}20`; // Back to 20% opacity
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Products */}
      <section ref={bestProductsRef} className="py-20 px-4 mt-12">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: themeColors.text }}
            >
              Best Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg"
              style={{ color: themeColors.textSecondary }}
            >
              Discover our most popular and highly-rated items
            </motion.p>
          </div>

          {/* Loading State */}
          {bestProductsLoading && (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {bestProductsError && !bestProductsLoading && (
            <div
              className="text-center py-16 rounded-xl"
              style={{ backgroundColor: `${themeColors.backgroundTertiary}50` }}
            >
              <FiAlertCircle
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: themeColors.textMuted }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: themeColors.text }}
              >
                Unable to load products
              </h3>
              <p style={{ color: themeColors.textSecondary }}>
                {bestProductsError}
              </p>
            </div>
          )}

          {/* No Products State */}
          {!bestProductsLoading && !bestProductsError && (!bestProducts || bestProducts.length === 0) && (
            <div
              className="text-center py-16 rounded-xl"
              style={{ backgroundColor: `${themeColors.backgroundTertiary}50` }}
            >
              <FiInfo
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: themeColors.textMuted }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: themeColors.text }}
              >
                No best products yet
              </h3>
              <p style={{ color: themeColors.textSecondary }}>
                This business hasn't marked any products as best yet.
              </p>
            </div>
          )}

          {/* Swiper Carousel */}
          {!bestProductsLoading && !bestProductsError && bestProducts && bestProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              grabCursor={true}
              slidesPerView="auto"
              speed={600}
              spaceBetween={20}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
                renderBullet: function (_, className) {
                  return '<span class="' + className + ' !bg-primary !opacity-100"></span>';
                },
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              touchRatio={1}
              threshold={10}
              longSwipes={true}
              followFinger={true}
              allowTouchMove={true}
              simulateTouch={true}
              resistance={true}
              resistanceRatio={0.85}
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 15,
                },
                640: {
                  slidesPerView: 1.8,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 2.8,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 3.5,
                  spaceBetween: 35,
                },
              }}
              className="!pb-16 !pt-4"
              style={{
                '--swiper-navigation-size': '24px',
                '--swiper-pagination-color': themeColors.primary,
                '--swiper-pagination-bullet-inactive-color': themeColors.textMuted,
                '--swiper-pagination-bullet-inactive-opacity': '0.4',
                '--swiper-pagination-bullet-opacity': '1',
                '--swiper-pagination-bullet-horizontal-gap': '6px',
              }}
            >
              {bestProducts.map((product, index) => (
                <SwiperSlide key={product._id} className="!w-72 !h-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    className="group rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full backdrop-blur-sm"
                    style={{
                      backgroundColor: `${themeColors.backgroundSecondary}90`,
                      borderColor: `${themeColors.border}80`,
                      border: `1px solid ${themeColors.border}80`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${themeColors.primary}50`;
                      e.currentTarget.style.backgroundColor = themeColors.backgroundSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${themeColors.border}80`;
                      e.currentTarget.style.backgroundColor = `${themeColors.backgroundSecondary}90`;
                    }}
                    whileHover={{
                      scale: 1.01,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{
                      scale: 0.99,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.image?.url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=center'}
                        alt={product.nom}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                          style={{
                            backgroundColor: `${themeColors.primary}30`,
                            color: themeColors.primary,
                            border: `1px solid ${themeColors.primary}50`
                          }}
                        >
                          {product.categorie?.nom || 'Product'}
                        </span>
                      </div>

                      {/* Promotional Badge */}
                      {product.promo_prix && (
                        <div className="absolute top-4 right-4">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: themeColors.error,
                              color: themeColors.backgroundSecondary
                            }}
                          >
                            PROMO
                          </span>
                        </div>
                      )}

                      {/* Dietary Icons */}
                      <div className="absolute bottom-4 right-4 flex gap-1">
                        {product.isVegetarian && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: themeColors.success,
                              color: themeColors.backgroundSecondary
                            }}
                          >
                            V
                          </span>
                        )}
                        {product.isHalal && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: themeColors.accent,
                              color: themeColors.backgroundSecondary
                            }}
                          >
                            H
                          </span>
                        )}
                        {product.isSpicy && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: themeColors.error,
                              color: themeColors.backgroundSecondary
                            }}
                          >
                            🌶️
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold mb-3 line-clamp-1"
                        style={{ color: themeColors.text }}
                      >
                        {product.nom}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        {product.promo_prix ? (
                          <>
                            <span
                              className="text-2xl font-bold"
                              style={{ color: themeColors.primary }}
                            >
                              {product.promo_prix} DH
                            </span>
                            <span
                              className="text-lg line-through"
                              style={{ color: themeColors.textMuted }}
                            >
                              {product.prix} DH
                            </span>
                          </>
                        ) : (
                          <span
                            className="text-2xl font-bold"
                            style={{ color: themeColors.primary }}
                          >
                            {product.prix} DH
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm mb-4 line-clamp-2 leading-relaxed"
                        style={{ color: themeColors.textSecondary }}
                      >
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className="h-4 w-4 fill-current"
                                style={{
                                  color: i < Math.round((product.ratings?.percentage || 0) / 20)
                                    ? themeColors.warning
                                    : themeColors.textMuted
                                }}
                              />
                            ))}
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: themeColors.textMuted }}
                          >
                            ({product.ratings?.total || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div
              className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg"
              style={{
                backgroundColor: `${themeColors.backgroundSecondary}E6`,
                color: themeColors.text,
                borderColor: themeColors.border,
                border: `1px solid ${themeColors.border}`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.backgroundSecondary;
                e.target.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = `${themeColors.backgroundSecondary}E6`;
                e.target.style.borderColor = themeColors.border;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div
              className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg"
              style={{
                backgroundColor: `${themeColors.backgroundSecondary}E6`,
                color: themeColors.text,
                borderColor: themeColors.border,
                border: `1px solid ${themeColors.border}`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.backgroundSecondary;
                e.target.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = `${themeColors.backgroundSecondary}E6`;
                e.target.style.borderColor = themeColors.border;
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
          )}

          {/* View Full Menu Button */}
          {currentBusiness?.menu_code && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Link
                to={`/menu/${currentBusiness.menu_code}`}
                className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                style={{
                  backgroundColor: themeColors.primary,
                  color: themeColors.backgroundSecondary,
                  boxShadow: `0 10px 25px ${themeColors.primary}40`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = themeColors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = themeColors.primary;
                }}
              >
                <FiMenu className="h-6 w-6 mr-3" />
                View Full Menu
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Operating Hours */}
      <section
        ref={hoursRef}
        className="py-20 px-4 mt-12"
        style={{ backgroundColor: `${themeColors.backgroundTertiary}50` }}
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-4 rounded-2xl"
                  style={{
                    backgroundColor: `${themeColors.primary}30`,
                    borderColor: `${themeColors.primary}50`,
                    border: `1px solid ${themeColors.primary}50`
                  }}
                >
                  <FiClock
                    className="h-8 w-8"
                    style={{ color: themeColors.primary }}
                  />
                </motion.div>
                <div className="text-left">
                  <h2
                    className="text-4xl md:text-5xl font-bold"
                    style={{ color: themeColors.text }}
                  >
                    Operating Hours
                  </h2>
                  <p
                    className="text-lg mt-2"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Visit us during our business hours
                  </p>
                </div>
              </div>

              {/* Current Status Banner */}
              {currentBusiness?.operatingHours && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg"
                  style={{
                    background: isCurrentlyOpen()
                      ? `linear-gradient(to right, ${themeColors.success}CC, ${themeColors.success}B3)`
                      : `linear-gradient(to right, ${themeColors.error}CC, ${themeColors.error}B3)`,
                    color: themeColors.backgroundSecondary,
                    borderColor: isCurrentlyOpen() ? `${themeColors.success}80` : `${themeColors.error}80`,
                    border: `1px solid ${isCurrentlyOpen() ? `${themeColors.success}80` : `${themeColors.error}80`}`
                  }}
                >
                  {isCurrentlyOpen() ? (
                    <>
                      <FiCheckCircle className="h-6 w-6" />
                      <span>Open Now</span>
                    </>
                  ) : (
                    <>
                      <FiXCircle className="h-6 w-6" />
                      <span>Currently Closed</span>
                      {getNextOpeningTime() && (
                        <span
                          className="text-sm opacity-80"
                          style={{ color: `${themeColors.backgroundSecondary}E6` }}
                        >
                          • Opens {getNextOpeningTime().day} at {getNextOpeningTime().time}
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Hours Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-4 md:gap-6"
            >
              {daysOfWeek.map((day, index) => {
                const dayData = currentBusiness?.operatingHours?.[day.id];
                const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1); // Adjust for Sunday being 0
                const isClosed = !dayData || dayData.closed;

                return (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-300"
                    style={{
                      background: isToday
                        ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.primary}15, ${themeColors.primary}10)`
                        : themeColors.backgroundSecondary,
                      borderColor: isToday ? `${themeColors.primary}40` : themeColors.border,
                      border: `${isToday ? '2px' : '1px'} solid ${isToday ? `${themeColors.primary}40` : themeColors.border}`,
                      boxShadow: isToday
                        ? `0 10px 25px ${themeColors.primary}20, 0 4px 6px ${themeColors.primary}10`
                        : `0 1px 3px ${themeColors.border}40`
                    }}
                    onMouseEnter={(e) => {
                      if (!isToday) {
                        e.currentTarget.style.backgroundColor = `${themeColors.backgroundTertiary}80`;
                        e.currentTarget.style.borderColor = themeColors.borderHover;
                        e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.border}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isToday) {
                        e.currentTarget.style.backgroundColor = themeColors.backgroundSecondary;
                        e.currentTarget.style.borderColor = themeColors.border;
                        e.currentTarget.style.boxShadow = `0 1px 3px ${themeColors.border}40`;
                      }
                    }}
                  >
                    {/* Background Pattern for Today */}
                    {isToday && (
                      <div className="absolute inset-0 opacity-5">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to bottom right, ${themeColors.primary}30, transparent)`
                          }}
                        ></div>
                      </div>
                    )}

                    <div className="relative p-6 flex items-center justify-between">
                      {/* Day Info */}
                      <div className="flex items-center gap-4">
                        {/* Day Icon */}
                        <div
                          className="p-3 rounded-xl transition-all duration-300"
                          style={{
                            backgroundColor: isToday
                              ? `${themeColors.primary}30`
                              : isClosed
                                ? `${themeColors.backgroundTertiary}80`
                                : `${themeColors.backgroundTertiary}60`,
                            color: isToday
                              ? themeColors.primary
                              : isClosed
                                ? themeColors.textMuted
                                : themeColors.textSecondary
                          }}
                        >
                          {isToday ? (
                            <FiSun className="h-5 w-5" />
                          ) : isClosed ? (
                            <FiMoon className="h-5 w-5" />
                          ) : (
                            <FiClock className="h-5 w-5" />
                          )}
                        </div>

                        {/* Day Name */}
                        <div>
                          <h3
                            className="font-bold text-xl"
                            style={{
                              color: isToday ? themeColors.primary : themeColors.text
                            }}
                          >
                            {day.label}
                          </h3>
                          {isToday && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full mt-1"
                              style={{
                                backgroundColor: `${themeColors.primary}30`,
                                color: themeColors.primary,
                                borderColor: `${themeColors.primary}40`,
                                border: `1px solid ${themeColors.primary}40`
                              }}
                            >
                              <FiCheckCircle className="h-3 w-3" />
                              Today
                            </motion.span>
                          )}
                        </div>
                      </div>

                      {/* Hours Info */}
                      <div className="text-right">
                        {isClosed ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="text-lg font-semibold"
                              style={{ color: themeColors.textMuted }}
                            >
                              Closed
                            </span>
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${themeColors.backgroundTertiary}80` }}
                            >
                              <FiXCircle
                                className="h-4 w-4"
                                style={{ color: themeColors.textMuted }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div
                                className="text-lg font-bold"
                                style={{
                                  color: isToday ? themeColors.primary : themeColors.text
                                }}
                              >
                                {formatTime(dayData.open)} - {formatTime(dayData.close)}
                              </div>
                              {isToday && isCurrentlyOpen() && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                  className="text-sm font-medium"
                                  style={{ color: themeColors.success }}
                                >
                                  Open Now
                                </motion.div>
                              )}
                            </div>
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: isToday
                                  ? `${themeColors.primary}30`
                                  : `${themeColors.backgroundTertiary}80`,
                                color: isToday
                                  ? themeColors.primary
                                  : themeColors.textSecondary
                              }}
                            >
                              <FiCheckCircle className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `linear-gradient(to right, ${themeColors.primary}05, transparent)`
                      }}
                    ></div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Additional Info */}
            {currentBusiness?.operatingHours && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 p-6 rounded-2xl text-center"
                style={{
                  backgroundColor: `${themeColors.backgroundTertiary}40`,
                  borderColor: `${themeColors.border}50`,
                  border: `1px solid ${themeColors.border}50`
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: themeColors.textMuted }}
                >
                  Hours may vary on holidays. Please call ahead to confirm.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section ref={contactRef} className="py-20 px-4 mt-12">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: themeColors.text }}
              >
                Get In Touch
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: themeColors.textSecondary }}
              >
                Visit our location or connect with us through your preferred platform
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              {/* Visit Us Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="p-3 rounded-2xl"
                    style={{
                      backgroundColor: `${themeColors.primary}20`,
                      borderColor: `${themeColors.primary}30`,
                      border: `1px solid ${themeColors.primary}30`
                    }}
                  >
                    <FiMapPin
                      className="h-6 w-6"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                  <h3
                    className="text-3xl font-bold"
                    style={{ color: themeColors.text }}
                  >
                    Visit Us
                  </h3>
                </div>

                <div className="space-y-6">
                  {currentBusiness?.adress && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="p-2 rounded-lg transition-colors duration-300"
                          style={{
                            backgroundColor: `${themeColors.backgroundTertiary}50`,
                            color: themeColors.textMuted
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${themeColors.backgroundTertiary}80`;
                            e.target.style.color = themeColors.textSecondary;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = `${themeColors.backgroundTertiary}50`;
                            e.target.style.color = themeColors.textMuted;
                          }}
                        >
                          <FiMapPin className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-lg mb-1"
                            style={{ color: themeColors.text }}
                          >
                            Address
                          </h4>
                          <p
                            className="text-base leading-relaxed"
                            style={{ color: themeColors.textSecondary }}
                          >
                            {currentBusiness.adress}
                          </p>
                          {currentBusiness?.ville && (
                            <p
                              className="text-base"
                              style={{ color: themeColors.textSecondary }}
                            >
                              {currentBusiness.ville}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {getBusinessPhone() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="p-2 rounded-lg transition-colors duration-300"
                          style={{
                            backgroundColor: `${themeColors.backgroundTertiary}50`,
                            color: themeColors.textMuted
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${themeColors.backgroundTertiary}80`;
                            e.target.style.color = themeColors.textSecondary;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = `${themeColors.backgroundTertiary}50`;
                            e.target.style.color = themeColors.textMuted;
                          }}
                        >
                          <FiPhone className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-lg mb-1"
                            style={{ color: themeColors.text }}
                          >
                            Phone
                          </h4>
                          <a
                            href={formatPhoneForCall(getBusinessPhone())}
                            className="text-base transition-colors duration-300 hover:underline"
                            style={{ color: themeColors.textSecondary }}
                            onMouseEnter={(e) => {
                              e.target.style.color = themeColors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = themeColors.textSecondary;
                            }}
                          >
                            {getBusinessPhone()}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Connect With Us Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="p-3 rounded-2xl"
                    style={{
                      backgroundColor: `${themeColors.primary}30`,
                      borderColor: `${themeColors.primary}50`,
                      border: `1px solid ${themeColors.primary}50`
                    }}
                  >
                    <FiExternalLink
                      className="h-6 w-6"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                  <h3
                    className="text-3xl font-bold"
                    style={{ color: themeColors.text }}
                  >
                    Connect With Us
                  </h3>
                </div>

                {currentBusiness?.socialMedia && Object.keys(currentBusiness.socialMedia).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(currentBusiness.socialMedia).map(([platform, value], index) => {
                      if (!value) return null;

                      // Professional social media icon mapping
                      const socialIconsMap = {
                        facebook: { icon: FaFacebook, color: darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700' },
                        instagram: { icon: FaInstagram, color: darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700' },
                        tiktok: { icon: FaTiktok, color: darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-black' },
                        snapchat: { icon: FaSnapchat, color: darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-600' },
                        pinterest: { icon: FaPinterest, color: darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700' },
                        linkedin: { icon: FaLinkedin, color: darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800' },
                        whatsapp: { icon: FaWhatsapp, color: darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700' },
                        telegram: { icon: FaTelegram, color: darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600' }
                      };

                      const socialConfig = socialIconsMap[platform];
                      if (!socialConfig) return null;

                      const IconComponent = socialConfig.icon;

                      return (
                        <motion.a
                          key={platform}
                          href={generateSocialMediaLink(platform, value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          whileHover={{ x: 8 }}
                          className="group flex items-center gap-4 py-3 transition-all duration-300"
                        >
                          <div
                            className="p-3 rounded-xl transition-all duration-300"
                            style={{
                              backgroundColor: `${themeColors.backgroundTertiary}80`
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = `${themeColors.backgroundTertiary}B3`;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = `${themeColors.backgroundTertiary}80`;
                            }}
                          >
                            <IconComponent className={`h-5 w-5 transition-colors duration-300 ${socialConfig.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4
                              className="font-semibold text-lg capitalize transition-colors duration-300"
                              style={{ color: themeColors.text }}
                              onMouseEnter={(e) => {
                                e.target.style.color = themeColors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = themeColors.text;
                              }}
                            >
                              {platform}
                            </h4>
                            <p
                              className="text-sm transition-colors duration-300"
                              style={{ color: themeColors.textSecondary }}
                              onMouseEnter={(e) => {
                                e.target.style.color = themeColors.text;
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = themeColors.textSecondary;
                              }}
                            >
                              Follow us on {platform}
                            </p>
                          </div>
                          <FiExternalLink
                            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ color: themeColors.textMuted }}
                          />
                        </motion.a>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="text-center py-8"
                    style={{ color: themeColors.textSecondary }}
                  >
                    <FiMail
                      className="h-12 w-12 mx-auto mb-3"
                      style={{ color: themeColors.textMuted }}
                    />
                    <p className="text-lg">No social media links available</p>
                    <p className="text-sm mt-1">Contact us directly for more information</p>
                  </motion.div>
                )}

                {/* Direct Contact Section */}
                {(currentBusiness?.socialMedia?.whatsapp || currentBusiness?.socialMedia?.telegram) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="mt-8 pt-8"
                    style={{
                      borderTop: `1px solid ${themeColors.border}50`
                    }}
                  >
                    <h4
                      className="text-lg font-semibold mb-4"
                      style={{ color: themeColors.text }}
                    >
                      Direct Messaging
                    </h4>
                    <div className="space-y-3">
                      {currentBusiness.socialMedia.whatsapp && (
                        <a
                          href={generateSocialMediaLink('whatsapp', currentBusiness.socialMedia.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 py-2 transition-colors duration-300"
                          style={{ color: themeColors.success }}
                          onMouseEnter={(e) => {
                            e.target.style.color = `${themeColors.success}CC`; // Slightly lighter on hover
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = themeColors.success;
                          }}
                        >
                          <FaWhatsapp className="h-5 w-5" />
                          <span className="font-medium">WhatsApp: {currentBusiness.socialMedia.whatsapp}</span>
                        </a>
                      )}
                      {currentBusiness.socialMedia.telegram && (
                        <a
                          href={generateSocialMediaLink('telegram', currentBusiness.socialMedia.telegram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 py-2 transition-colors duration-300"
                          style={{ color: themeColors.info }}
                          onMouseEnter={(e) => {
                            e.target.style.color = `${themeColors.info}CC`; // Slightly lighter on hover
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = themeColors.info;
                          }}
                        >
                          <FaTelegram className="h-5 w-5" />
                          <span className="font-medium">Telegram: {currentBusiness.socialMedia.telegram}</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Component */}
      <section
        className="py-20 px-4 mt-12"
        style={{ backgroundColor: `${themeColors.backgroundTertiary}50` }}
      >
        <div className="container mx-auto text-center">
          <h3
            className="text-3xl font-bold mb-6"
            style={{ color: themeColors.text }}
          >
            Rate Your Experience
          </h3>
          <div className="max-w-md mx-auto">
            <BusinessRating businessId={currentBusiness?._id} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4 mt-16"
        style={{ backgroundColor: themeColors.backgroundTertiary }}
      >
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {currentBusiness?.logo?.url ? (
              <img
                src={currentBusiness.logo.url}
                alt={currentBusiness?.nom}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <FiCoffee
                className="h-6 w-6"
                style={{ color: themeColors.warning }}
              />
            )}
            <h4
              className="text-xl font-bold"
              style={{ color: themeColors.text }}
            >
              {currentBusiness?.nom || 'Business'}
            </h4>
          </div>
          <p
            className="mb-4"
            style={{ color: themeColors.textMuted }}
          >
            {currentBusiness?.description ?
              currentBusiness.description.substring(0, 60) + '...' :
              'Brew your perfect moment with us!'
            }
          </p>
          <p
            className="text-sm"
            style={{ color: themeColors.textSecondary }}
          >
            © 2024 {currentBusiness?.nom || 'Business'}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Back to Home Button */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl backdrop-blur-sm transition-all duration-300 group"
        title="Back to Home"
        style={{
          backgroundColor: `${themeColors.primary}E6`, // 90% opacity
          color: themeColors.backgroundSecondary,
          borderColor: `${themeColors.primary}50`, // 50% opacity
          border: `1px solid ${themeColors.primary}50`,
          boxShadow: `0 10px 25px ${themeColors.primary}30, 0 0 0 1px ${themeColors.primary}20` // Better shadow opacity
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = themeColors.primaryHover;
          e.target.style.borderColor = `${themeColors.primaryHover}60`;
          e.target.style.boxShadow = `0 15px 35px ${themeColors.primaryHover}40, 0 0 0 1px ${themeColors.primaryHover}30`;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = `${themeColors.primary}E6`;
          e.target.style.borderColor = `${themeColors.primary}50`;
          e.target.style.boxShadow = `0 10px 25px ${themeColors.primary}30, 0 0 0 1px ${themeColors.primary}20`;
        }}
      >
        <FiHome
          className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
          style={{ color: 'inherit' }}
        />

        {/* Tooltip */}
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg"
          style={{
            backgroundColor: themeColors.backgroundTertiary,
            color: themeColors.text,
            borderColor: themeColors.border,
            border: `1px solid ${themeColors.border}`,
            boxShadow: `0 8px 20px ${themeColors.border}40`
          }}
        >
          Back to Home
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: themeColors.backgroundTertiary }}
          ></div>
        </div>
      </motion.button>
    </div>
  );
};

export default BusinessProfile;
