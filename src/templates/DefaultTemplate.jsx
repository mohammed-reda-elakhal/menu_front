import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { RatingComponent, RatingStats } from '../services/RatingService';

/**
 * Recommended image sizes:
 * - Business Logo: 300x300px (min 200x200px)
 * - Category Icons: 120x120px (min 96x96px)
 * - Product Images: 500x500px (min 400x400px)
 * All images should be square (1:1 aspect ratio)
 */

const SocialIcon = ({ icon, href, color, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`${color} p-2 rounded-full bg-gray-800 hover:bg-gray-700`}
  >
    {icon}
  </motion.a>
);

// We're now using the RatingComponent from RatingService.jsx

const DefaultTemplate = ({ menuData, refreshData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all'); // Changed from null to 'all'
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed from true to false
  const [previewImage, setPreviewImage] = useState(null);

  // Handle successful rating submission
  const handleRatingSubmit = () => {
    // Refresh the menu data to get updated ratings
    if (refreshData && typeof refreshData === 'function') {
      // Add a small delay to allow the backend to process the rating
      setTimeout(() => {
        refreshData();
      }, 500);
    }
  };

  useEffect(() => {
    // Removed default category selection since we're using 'all' by default
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [menuData]);

  // Updated getAllProducts function to return categorized products
  const getAllProducts = () => {
    return menuData?.categories?.map(cat => ({
      categoryName: cat.nom,
      products: cat.produits
    })) || [];
  };

  const socialIcons = {
    facebook: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>,
      color: "text-blue-400 hover:text-blue-300"
    },
    instagram: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>,
      color: "text-pink-400 hover:text-pink-300"
    },
    whatsapp: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>,
      color: "text-green-400 hover:text-green-300"
    },
    tiktok: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>,
      color: "text-slate-200 hover:text-white"
    },
    snapchat: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206 21.364c-.093 0-.185-.003-.277-.01a3.836 3.836 0 01-.426-.038 4.054 4.054 0 01-1.13-.358 3.93 3.93 0 01-.443-.244c-.276-.17-.526-.345-.76-.527-.303-.236-.577-.483-.825-.744a4.308 4.308 0 01-.433-.503c-.084-.11-.14-.187-.145-.193-.084-.105-.144-.186-.182-.24a.295.295 0 01-.064-.219.288.288 0 01.134-.187c.076-.046.157-.069.237-.069.038 0 .075.005.112.014.182.046.363.098.541.156.157.052.314.107.472.166.238.09.475.185.71.286.226.097.45.198.674.304.222.105.443.214.663.327.22.112.438.227.657.345.218.117.436.236.653.357.217.12.433.243.648.368.215.124.43.25.643.378.214.128.427.258.64.39.212.13.424.263.636.397.21.133.42.268.63.404.21.136.42.273.63.41l.628.416c.21.14.42.28.628.422.21.142.418.285.627.43.208.143.416.288.624.434.207.145.414.292.62.44.206.147.412.296.617.445.205.15.41.3.613.452.204.152.407.305.61.46.202.154.403.31.604.466.2.157.4.315.6.475.198.16.396.32.594.482.197.162.393.326.59.49.195.165.39.332.584.5.194.168.387.337.58.507.193.17.385.343.577.516.192.173.383.348.573.524.19.176.38.354.57.532.188.18.376.36.564.54.187.182.373.365.558.55.186.185.37.37.555.558.184.187.367.376.55.566.182.19.364.38.545.572.18.192.36.385.54.58.178.195.356.392.534.59.177.197.353.396.528.595l.523.6c.174.202.347.405.52.61.172.204.343.41.513.617.17.207.338.415.507.624.168.21.336.42.503.632.166.212.332.425.496.64.165.215.328.43.49.648.163.217.325.436.486.656.161.22.321.44.48.663.16.222.318.446.476.67.158.225.315.45.47.677.156.228.31.457.464.687.153.23.305.462.456.694.151.233.301.467.45.702.148.235.295.472.44.71.146.238.29.477.433.716.143.24.285.482.426.724.14.243.28.487.417.732.138.245.274.492.41.74.135.247.27.496.402.745.133.25.264.5.394.752.13.253.26.507.387.762.128.255.255.512.38.77.125.258.248.517.37.778.122.26.243.523.362.786.12.263.238.528.355.794.117.266.233.533.347.802.115.268.228.538.34.81.112.27.223.544.332.817.11.273.218.548.325.825.107.277.213.555.317.835.104.28.207.56.308.843.101.282.201.566.3.85.098.285.195.572.29.86.095.288.189.578.282.868.092.291.183.584.273.877.089.294.177.59.264.886.086.297.171.595.255.894.084.3.166.6.247.902.08.302.16.606.238.91.078.305.154.612.23.92.074.308.148.617.22.927.072.31.142.623.211.936.069.313.136.628.202.944.066.316.13.633.193.95.063.32.124.64.184.96.06.322.118.646.175.97.057.325.112.652.166.98.054.327.106.656.157.985.05.33.1.66.147.992.048.332.093.666.137.999.044.335.086.67.127 1.006.04.337.08.675.117 1.013.037.34.072.68.106 1.02.034.342.066.685.097 1.028.03.344.06.688.087 1.033l.078 1.038c.025.347.048.695.069 1.044.021.349.04.699.058 1.049.018.35.034.702.049 1.054.014.352.027.705.038 1.058.011.354.02.709.027 1.063.008.356.013.711.017 1.068.004.357.006.715.006 1.073 0 .168-.034.328-.095.472a1.17 1.17 0 01-1.098.72z"/></svg>,
      color: "text-yellow-400 hover:text-yellow-300"
    },
    telegram: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
      color: "text-blue-400 hover:text-blue-300"
    },
    pinterest: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>,
      color: "text-red-400 hover:text-red-300"
    },
  };

  const themeColors = {
    bg: isDarkMode ? 'bg-gray-950' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-200' : 'text-gray-800',
    card: isDarkMode ? 'bg-gray-900' : 'bg-white',
    cardHover: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
    header: isDarkMode ? 'bg-gray-900/90' : 'bg-white/90',
    input: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    accent: 'text-[#FFB11F]',
    accentBg: 'bg-[#FFB11F]',
    glowFrom: 'from-[#FFB11F]/20',
    glowTo: 'to-[#FFB11F]/10',
  };

  if (!menuData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeColors.bg} ${themeColors.text}`}>
        <div className={`${themeColors.card} p-8 rounded-lg shadow-lg text-center`}>
          <h2 className={`text-2xl font-bold ${themeColors.accent} mb-4`}>No Menu Data Available</h2>
          <p className={themeColors.muted}>Please check that the menu exists and is properly configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${themeColors.header} backdrop-blur-md border-b ${themeColors.border}`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {menuData.business?.logo?.url && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative flex-shrink-0"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${themeColors.glowFrom} ${themeColors.glowTo} rounded-full blur-md opacity-40`} />

                  {/* Ring Effect */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-900" />

                  {/* Image */}
                  <div className="relative z-10 w-14 h-14 rounded-full overflow-hidden bg-gray-800">
                    <LazyLoadImage
                      src={menuData.business.logo.url}
                      alt={menuData.business.nom}
                      className="w-full h-full object-cover"
                      effect="blur"
                      wrapperClassName="!block w-full h-full"
                    />
                  </div>
                </motion.div>
              )}
              <div>
                <h1 className={`text-lg font-bold ${themeColors.accent}`}>
                  {menuData.business?.nom}
                </h1>
                <p className={`text-xs ${themeColors.muted}`}>{menuData.business?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              {refreshData && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshData}
                  className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
                  title="Refresh menu data"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.button>
              )}

              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-800'}`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 pb-24"> {/* Changed from max-w-7xl to max-w-5xl */}
        {/* Categories section with padding for scrollbar */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 px-1 -mx-1">
          <div className="flex gap-4 py-1">
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${selectedCategory === 'all'
                  ? `${themeColors.accentBg} text-white`
                  : `${themeColors.card} ${themeColors.muted} ${themeColors.cardHover}`}`}
            >
              <span className="text-sm font-medium whitespace-nowrap">All Products</span>
            </motion.button>

            {menuData.categories?.map((category) => (
              <motion.button
                key={category._id}
                onClick={() => setSelectedCategory(category._id === selectedCategory ? null : category._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${selectedCategory === category._id
                    ? `${themeColors.accentBg} text-white`
                    : `${themeColors.card} ${themeColors.muted} ${themeColors.cardHover}`}`}
              >
                {category.image?.url && (
                  <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-gray-700">
                    <LazyLoadImage
                      src={category.image.url}
                      alt={category.nom}
                      className="w-full h-full object-cover"
                      effect="blur"
                    />
                  </div>
                )}
                <span className="text-sm font-medium whitespace-nowrap">{category.nom}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Updated Products Grid */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {selectedCategory === 'all' ? (
                // Display products grouped by category
                getAllProducts().map((group, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {/* Category Header */}
                    <div className="mb-4 flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-300">{group.categoryName}</h3>
                      <div className={`h-[1px] flex-1 ${themeColors.border}`}></div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 px-1"> {/* Updated grid to show 4 items per row */}
                      {group.products.map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group relative flex flex-col items-center p-2 ${themeColors.card}
                            rounded-lg ${themeColors.cardHover} transition-all duration-300
                            hover:shadow-lg hover:shadow-[#FFB11F]/5 border border-gray-800/10`}
                        >
                          {/* Product Image - Improved layout */}
                          {product.image?.url && (
                            <div className="relative mb-4 w-full">
                              <div className="relative mx-auto w-full aspect-square rounded-lg overflow-hidden group/image">
                                {/* Background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#FFB11F]/10 to-transparent opacity-70"></div>

                                {/* Image container */}
                                <div className="w-full h-full overflow-hidden">
                                  <div className="w-full h-full transform group-hover/image:scale-110 transition-transform duration-500">
                                    <LazyLoadImage
                                      src={product.image.url}
                                      alt={product.nom}
                                      className="w-full h-full object-cover"
                                      effect="blur"
                                      wrapperClassName="!block w-full h-full"
                                    />
                                  </div>
                                </div>

                                {/* Zoom icon overlay */}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImage(product.image.url);
                                  }}
                                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 cursor-pointer"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-2 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </motion.div>
                                </div>
                              </div>

                              {/* Product Name Label */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-max z-10">
                                <div className={`${themeColors.accentBg} text-white px-2 py-0.5
                                  rounded-full shadow-lg shadow-[#FFB11F]/20`}>
                                  <span className="text-[10px] font-medium whitespace-nowrap">
                                    {product.nom}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Product Details - Improved layout */}
                          <div className="w-full mt-4 space-y-1">
                            {/* Price with better styling */}
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <span className={`text-base font-bold ${themeColors.accent}`}>
                                {product.promo_prix ? (
                                  <>{product.promo_prix} <span className="text-xs">DH</span></>
                                ) : (
                                  <>{product.prix} <span className="text-xs">DH</span></>
                                )}
                              </span>
                              {product.promo_prix && (
                                <span className="text-xs text-gray-500 line-through">
                                  {product.prix} DH
                                </span>
                              )}
                            </div>

                            {/* Description with better styling */}
                            {product.description && (
                              <p className={`${themeColors.muted} text-[10px] line-clamp-1 px-1 text-center`}>
                                {product.description} <span>
                                    ( {product?.ratings?.positive} 👍 )
                                  </span>
                              </p>
                            )}

                            {/* Components with better styling - limited to 2 */}
                            {product.composant?.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-0.5 px-1 mt-1">
                                {product.composant.slice(0, 2).map((comp, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-[8px] px-1.5 py-0.5 rounded-full
                                      ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-100'}
                                      ${themeColors.muted} border ${themeColors.border}`}
                                  >
                                    {comp}
                                  </span>
                                ))}
                                {product.composant.length > 2 && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full
                                    ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-100'}
                                    ${themeColors.muted} border ${themeColors.border}`}>
                                    +{product.composant.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Product Rating Component */}
                            <RatingComponent
                              itemId={product._id}
                              itemType="product"
                              isDarkMode={isDarkMode}
                              themeColors={themeColors}
                              onRatingSubmit={handleRatingSubmit}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))
              ) : (
                // Single category display (updated to match)
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 px-1"> {/* Updated grid to show 4 items per row */}
                  {menuData.categories?.find(cat => cat._id === selectedCategory)?.produits.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative flex flex-col items-center p-2 ${themeColors.card}
                        rounded-lg ${themeColors.cardHover} transition-all duration-300
                        hover:shadow-lg hover:shadow-[#FFB11F]/5 border border-gray-800/10`}
                    >
                      {/* Product Image - Improved layout */}
                      {product.image?.url && (
                        <div className="relative mb-4 w-full">
                          <div className="relative mx-auto w-full aspect-square rounded-lg overflow-hidden group/image">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#FFB11F]/10 to-transparent opacity-70"></div>

                            {/* Image container */}
                            <div className="w-full h-full overflow-hidden">
                              <div className="w-full h-full transform group-hover/image:scale-110 transition-transform duration-500">
                                <LazyLoadImage
                                  src={product.image.url}
                                  alt={product.nom}
                                  className="w-full h-full object-cover"
                                  effect="blur"
                                  wrapperClassName="!block w-full h-full"
                                />
                              </div>
                            </div>

                            {/* Zoom icon overlay */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(product.image.url);
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 cursor-pointer"
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-2 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </motion.div>
                            </div>
                          </div>

                          {/* Product Name Label */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-max z-10">
                            <div className={`${themeColors.accentBg} text-white px-2 py-0.5
                              rounded-full shadow-lg shadow-[#FFB11F]/20`}>
                              <span className="text-[10px] font-medium whitespace-nowrap">
                                {product.nom}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Product Details - Improved layout */}
                      <div className="w-full mt-4 space-y-1">
                        {/* Price with better styling */}
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className={`text-base font-bold ${themeColors.accent}`}>
                            {product.promo_prix ? (
                              <>{product.promo_prix} <span className="text-xs">DH</span></>
                            ) : (
                              <>{product.prix} <span className="text-xs">DH</span></>
                            )}
                          </span>
                          {product.promo_prix && (
                            <span className="text-xs text-gray-500 line-through">
                              {product.prix} DH
                            </span>
                          )}
                        </div>

                        {/* Description with better styling */}
                        {product.description && (
                          <p className={`${themeColors.muted} text-[10px] line-clamp-1 px-1 text-center`}>
                            {product.description}
                          </p>
                        )}

                        {/* Components with better styling - limited to 2 */}
                        {product.composant?.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-0.5 px-1 mt-1">
                            {product.composant.slice(0, 2).map((comp, idx) => (
                              <span
                                key={idx}
                                className={`text-[8px] px-1.5 py-0.5 rounded-full
                                  ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-100'}
                                  ${themeColors.muted} border ${themeColors.border}`}
                              >
                                {comp}
                              </span>
                            ))}
                            {product.composant.length > 2 && (
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-full
                                ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-100'}
                                ${themeColors.muted} border ${themeColors.border}`}>
                                +{product.composant.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Product Rating Component */}
                        <RatingComponent
                          itemId={product._id}
                          itemType="product"
                          isDarkMode={isDarkMode}
                          themeColors={themeColors}
                          onRatingSubmit={handleRatingSubmit}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer with Social Media */}
      <footer className={`mt-8 border-t ${themeColors.border} bg-gradient-to-b from-transparent ${isDarkMode ? 'to-gray-900' : 'to-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Business Info */}
            <div className="text-center">
              <h2 className={`text-xl font-bold ${themeColors.accent}`}>
                {menuData.business?.nom}
              </h2>
              <p className={`text-sm ${themeColors.muted} mt-1`}>{menuData.business?.description}</p>
            </div>

            {/* Social Media Icons */}
            {menuData.socialMediaVisible && menuData.business?.socialMedia && (
              <div className="flex gap-3">
                {Object.entries(menuData.business.socialMedia).map(([platform, link]) => {
                  if (!link || !socialIcons[platform]) return null;
                  return (
                    <SocialIcon
                      key={platform}
                      icon={socialIcons[platform].icon}
                      href={platform === 'whatsapp' ? `https://wa.me/${link}` :
                            platform === 'telegram' ? `https://t.me/${link}` : link}
                      color={socialIcons[platform].color}
                      label={platform}
                    />
                  );
                })}
              </div>
            )}

            {/* Contact Info */}
            <div className={`text-center text-sm ${themeColors.muted}`}>
              <p>{menuData.business?.adress}</p>
              <p className="mt-1">{menuData.business?.tele}</p>
            </div>
          </div>
        </div>
      </footer>
      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-3xl max-h-[80vh] overflow-hidden rounded-xl"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/30 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewImage(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Image */}
              <div className="relative">
                <img
                  src={previewImage?.image?.url || previewImage}
                  alt={previewImage?.nom || "Preview"}
                  className="max-w-full max-h-[80vh] object-contain"
                />

                {/* Rating display if product has ratings */}
                {previewImage?.ratings && previewImage.ratings.total > 0 && (
                  <div className={`absolute bottom-0 left-0 right-0 p-3 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} flex items-center justify-center`}>
                    <RatingStats
                      ratings={previewImage.ratings}
                      isDarkMode={isDarkMode}
                      themeColors={themeColors}
                      customStyles={{
                        container: 'justify-center'
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DefaultTemplate;
