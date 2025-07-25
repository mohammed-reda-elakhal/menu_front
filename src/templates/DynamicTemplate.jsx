/**
 * DynamicTemplate.jsx - Food Menu Template
 *
 * IMAGE OPTIMIZATION GUIDELINES:
 * - Recommended image size: 500px x 500px (1:1 aspect ratio)
 * - All images are optimized with aspectRatio: '1/1' for consistent display
 * - Uses object-fit: 'cover' and object-position: 'center' for best cropping
 * - Includes lazy loading for performance optimization
 * - Supports responsive sizing while maintaining aspect ratio
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { FiMapPin, FiPhone, FiTag, FiCoffee, FiSearch, FiX } from 'react-icons/fi'; // Added FiSearch and FiX
import {
  MdRestaurant,
  MdFoodBank,
  MdOutlineDinnerDining,
  MdCoffeeMaker,
  MdLocalPizza,
  MdBakeryDining,
  MdIcecream,
  MdLocalBar
} from 'react-icons/md';
import {
  GiCook,
  GiCoffeeCup,
  GiKnifeFork,
  GiCupcake,
  GiChefToque,
  GiCookingPot,
  GiCroissant,
  GiDonut,
  GiHotMeal,
  GiCakeSlice
} from 'react-icons/gi';
import {
  BsCupHot,
  BsFillCupFill,
  BsStars
} from 'react-icons/bs';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io'; // Added for Modal close button

const DynamicTemplate = ({ menuData }) => {
  const { business, categories } = menuData;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { darkMode, currentColors } = useTheme();

  const getThemeColors = () => {
    return {
      bg: darkMode ? 'bg-gray-950' : 'bg-gray-50',
      text: darkMode ? 'text-gray-200' : 'text-gray-800',
      textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
      textMuted: darkMode ? 'text-gray-500' : 'text-gray-500',
      card: darkMode ? 'bg-gray-900' : 'bg-white',
      cardHover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
      border: darkMode ? 'border-gray-800' : 'border-gray-200',
      header: darkMode ? 'bg-gray-900/95' : 'bg-white/95',
      footer: darkMode ? 'bg-gray-900' : 'bg-gray-100',
      primary: currentColors.primary || (darkMode ? '#818cf8' : '#3768e5'),
      accent: currentColors.accent || (darkMode ? '#fbbf24' : '#d97706'),
      success: currentColors.success || (darkMode ? '#34d399' : '#10b981'),
      error: currentColors.error || (darkMode ? '#f87171' : '#ef4444'),
      foodAccent: darkMode ? '#f59e0b' : '#d97706',
      coffeeAccent: darkMode ? '#92400e' : '#a16207',
      freshAccent: darkMode ? '#059669' : '#047857',
      warmAccent: darkMode ? '#dc2626' : '#b91c1c',
    };
  };

  const getFoodIcons = () => [
    MdRestaurant, GiCoffeeCup, MdFoodBank, GiCook,
    BsCupHot, GiKnifeFork, MdOutlineDinnerDining,
    BsFillCupFill, GiCupcake, MdCoffeeMaker, FiCoffee,
    GiChefToque, GiCookingPot, MdLocalPizza, GiCroissant,
    GiDonut, MdBakeryDining, GiHotMeal, MdIcecream,
    GiCakeSlice, MdLocalBar
  ];

  const themeColors = getThemeColors();

  // Filter categories and products based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const searchLower = searchTerm.toLowerCase();

    return categories.map(category => {
      // Filter products within each category
      const filteredProducts = category.produits?.filter(product => {
        return (
          product.nom?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          category.nom?.toLowerCase().includes(searchLower) ||
          product.composant?.some(comp => comp.toLowerCase().includes(searchLower))
        );
      }) || [];

      // Filter supplementaries within each category
      const filteredSupplementaries = category.supplementaires?.filter(supp => {
        return (
          supp.nom?.toLowerCase().includes(searchLower) ||
          supp.description?.toLowerCase().includes(searchLower)
        );
      }) || [];

      // Only return category if it has matching products or supplementaries
      if (filteredProducts.length > 0 || filteredSupplementaries.length > 0) {
        return {
          ...category,
          produits: filteredProducts,
          supplementaires: filteredSupplementaries
        };
      }
      return null;
    }).filter(Boolean);
  }, [categories, searchTerm]);

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
  };

  const getSocialIcon = (platform) => {
    const iconProps = { className: "w-5 h-5" };
    switch (platform.toLowerCase()) {
      case 'facebook': return <FaFacebook {...iconProps} />;
      case 'instagram': return <FaInstagram {...iconProps} />;
      case 'twitter': return <FaTwitter {...iconProps} />;
      case 'whatsapp': return <FaWhatsapp {...iconProps} />;
      case 'telegram': return <FaTelegram {...iconProps} />;
      case 'linkedin': return <FaLinkedin {...iconProps} />;
      case 'youtube': return <FaYoutube {...iconProps} />;
      case 'tiktok': return <FaTiktok {...iconProps} />;
      default: return <FaFacebook {...iconProps} />;
    }
  };

  const ProductCard = ({ product, onSelect }) => (
    <motion.div
      onClick={onSelect}
      className={`${themeColors.card} rounded-lg border shadow-sm cursor-pointer overflow-hidden relative group transition-all duration-300 hover:shadow-md`}
      style={{
        borderColor: themeColors.foodAccent + '15',
        boxShadow: `0 1px 3px ${themeColors.foodAccent}05`
      }}
      whileHover={{
        scale: 1.01,
        y: -2,
        boxShadow: `0 4px 12px ${themeColors.foodAccent}10`
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-2 right-2">
          <GiHotMeal className="text-3xl" style={{ color: themeColors.foodAccent }} />
        </div>
        <div className="absolute bottom-2 left-2">
          <GiKnifeFork className="text-2xl" style={{ color: themeColors.coffeeAccent }} />
        </div>
      </div>
      {/* Product Image - Optimized for 500x500px */}
      {product.image?.url && (
        <div className="relative overflow-hidden">
          <motion.img
            src={product.image.url}
            alt={product.nom}
            className="w-full h-32 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              aspectRatio: '1/1', // Perfect square for 500x500px images
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            loading="lazy" // Optimize loading performance
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 right-2">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: themeColors.accent }}
              >
                <GiCupcake className="text-2xl opacity-80" />
              </motion.div>
            </div>
          </div>
        </div>
      )}
      <div className="p-3 relative z-10">
        <motion.h3
          className={`text-sm font-bold ${themeColors.text} mb-1 group-hover:text-opacity-90 transition-colors duration-300 line-clamp-1`}
          style={{ fontFamily: "'Inter', sans-serif" }}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {product.nom}
        </motion.h3>
        <p className={`${themeColors.textSecondary} text-xs mb-2 line-clamp-1 leading-relaxed`}>
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {product.isVegetarian && (
            <motion.span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex items-center space-x-1"
              style={{ backgroundColor: themeColors.freshAccent }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <GiCroissant className="w-2 h-2" />
              <span>Veg</span>
            </motion.span>
          )}
          {product.isSpicy && (
            <motion.span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex items-center space-x-1"
              style={{ backgroundColor: themeColors.warmAccent }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <GiHotMeal className="w-2 h-2" />
              <span>Spicy</span>
            </motion.span>
          )}
          {product.isHalal && (
            <motion.span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex items-center space-x-1"
              style={{ backgroundColor: themeColors.primary }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <MdRestaurant className="w-2 h-2" />
              <span>Halal</span>
            </motion.span>
          )}
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <motion.span
              className={`text-sm font-bold ${themeColors.text}`}
              style={{
                fontFamily: "'Inter', sans-serif",
                color: themeColors.foodAccent
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {product.promo_prix ? product.promo_prix : product.prix} DH
            </motion.span>
            {product.promo_prix && (
              <span className={`text-xs ${themeColors.textMuted} line-through`}>
                {product.prix} DH
              </span>
            )}
          </div>
          {product.promo_prix && (
            <motion.div
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: themeColors.warmAccent }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              PROMO
            </motion.div>
          )}
        </div>
        {product.ratings && (
          <motion.div
            className="flex items-center justify-between mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center space-x-1">
              {/* Star Rating Display */}
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, index) => {
                  const rating = product.ratings.average || (product.ratings.positive / Math.max(product.ratings.ratedBy?.length || 1, 1)) * 5;
                  const isFilled = index < Math.floor(rating);
                  const isHalfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + (index * 0.1),
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {isFilled ? (
                        <AiFillStar
                          className="w-3 h-3"
                          style={{ color: '#FFD700' }}
                        />
                      ) : isHalfFilled ? (
                        <AiFillStar
                          className="w-3 h-3"
                          style={{ color: '#FFD700', opacity: 0.5 }}
                        />
                      ) : (
                        <AiOutlineStar
                          className="w-3 h-3"
                          style={{ color: themeColors.textMuted }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Rating Number */}
              <motion.span
                className={`text-xs font-semibold ${themeColors.text}`}
                style={{ color: '#FFD700' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {product.ratings.average ?
                  product.ratings.average.toFixed(1) :
                  ((product.ratings.positive / Math.max(product.ratings.ratedBy?.length || 1, 1)) * 5).toFixed(1)
                }
              </motion.span>
            </div>

            {/* Review Count */}
            <motion.span
              className={`text-xs ${themeColors.textMuted}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              ({product.ratings.ratedBy?.length || 0})
            </motion.span>
          </motion.div>
        )}
        {product.composant && product.composant.length > 0 && (
          <motion.div
            className={`${themeColors.card} p-3 rounded-xl border`}
            style={{
              borderColor: themeColors.coffeeAccent + '30',
              backgroundColor: themeColors.coffeeAccent + '10'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <GiCookingPot className="w-4 h-4" style={{ color: themeColors.coffeeAccent }} />
              <span className={`${themeColors.text} font-medium text-sm`}>Ingredients:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.composant.slice(0, 3).map((comp, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-lg text-xs ${themeColors.textSecondary}`}
                  style={{ backgroundColor: themeColors.coffeeAccent + '20' }}
                >
                  {comp}
                </span>
              ))}
              {product.composant.length > 3 && (
                <span
                  className={`px-2 py-1 rounded-lg text-xs ${themeColors.textMuted}`}
                  style={{ backgroundColor: themeColors.border }}
                >
                  +{product.composant.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-transparent group-hover:to-black/5 transition-all duration-300 rounded-2xl pointer-events-none" />
      </div>
      <motion.div
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.2, rotate: 15 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: themeColors.primary }}
        >
          <MdOutlineDinnerDining className="w-4 h-4 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );

  const SupplementaryCard = ({ supplementary }) => (
    <motion.div
      className={`${themeColors.card} rounded-xl border ${themeColors.border} p-3 m-1 shadow-md hover:shadow-lg transition-all duration-300`}
      style={{ borderColor: themeColors.foodAccent + '20' }}
      whileHover={{ y: -4, scale: 1.03, boxShadow: `0 8px 25px ${themeColors.foodAccent}20` }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3 items-start">
        {/* Supplementary Image - Optimized for 500x500px */}
        {supplementary.image?.url && (
          <img
            src={supplementary.image.url}
            alt={supplementary.nom}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0 border"
            style={{
              borderColor: themeColors.foodAccent + '30',
              aspectRatio: '1/1', // Perfect square for 500x500px images
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            loading="lazy" // Optimize loading performance
          />
        )}
        <div className="flex-grow">
          <h4 className={`font-semibold text-sm sm:text-md ${themeColors.text} mb-0.5 line-clamp-1`}>{supplementary.nom}</h4>
          {supplementary.description && (
            <p className={`text-xs ${themeColors.textSecondary} mb-1 line-clamp-2`}>
              {supplementary.description}
            </p>
          )}
          <strong className={`text-sm font-bold`} style={{color: themeColors.accent}}>{supplementary.prix} DH</strong>
        </div>
      </div>
      {/* Optional: Uncomment to show minimal meta details if needed
      <div className={`text-xs ${themeColors.textMuted} mt-2 pt-1 border-t ${themeColors.border} space-y-0.5`}>
        <p className="truncate">ID: {supplementary._id}</p>
      </div>
      */}
    </motion.div>
  );

  const CategoryHeader = ({ category }) => {
    const categoryIcons = [
      MdRestaurant, GiCoffeeCup, MdLocalPizza, GiCupcake,
      MdBakeryDining, GiCroissant, MdIcecream, GiDonut,
      MdCoffeeMaker, GiHotMeal, MdLocalBar, GiCakeSlice
    ];
    const CategoryIcon = categoryIcons[Math.abs(category._id.charCodeAt(0)) % categoryIcons.length];

    return (
      <motion.div
        className="mb-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative Line Above */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${themeColors.accent}40, ${themeColors.primary}60, ${themeColors.accent}40, transparent)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Central Decorative Element */}
          <motion.div
            className="mx-4 flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: themeColors.accent }}
            >
              <CategoryIcon className="w-4 h-4 opacity-60" />
            </motion.div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: themeColors.accent }}
                />
              ))}
            </div>
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: themeColors.accent }}
            >
              <CategoryIcon className="w-4 h-4 opacity-60 transform scale-x-[-1]" />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${themeColors.accent}40, ${themeColors.primary}60, ${themeColors.accent}40, transparent)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* Category Content */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Category Image - Optimized for 500x500px */}
          {category.image?.url ? (
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.img
                src={category.image.url}
                alt={category.nom}
                className="w-16 h-16 object-cover rounded-full shadow-lg border-2"
                style={{
                  borderColor: themeColors.primary,
                  aspectRatio: '1/1', // Perfect square for 500x500px images
                  objectFit: 'cover',
                  objectPosition: 'center',
                  boxShadow: `0 4px 20px ${themeColors.primary}20`
                }}
                loading="lazy" // Optimize loading performance
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              />

              {/* Floating Ring Animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-30"
                style={{ borderColor: themeColors.accent }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          ) : (
            // Fallback icon when no image
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2"
              style={{
                backgroundColor: themeColors.primary + '20',
                borderColor: themeColors.primary,
                boxShadow: `0 4px 20px ${themeColors.primary}20`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <CategoryIcon className="text-2xl" style={{ color: themeColors.primary }} />

              {/* Floating Ring Animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-30"
                style={{ borderColor: themeColors.accent }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          {/* Category Name */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className={`text-2xl md:text-3xl font-bold ${themeColors.text} relative`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  textShadow: `1px 1px 2px ${themeColors.primary}10`
                }}>
              <span className="relative">
                {category.nom}
                {/* Animated Underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accent})`
                  }}
                />
              </span>
            </h2>

            {/* Category Description */}
            {category.description && (
              <motion.p
                className={`${themeColors.textSecondary} text-sm mt-2 max-w-md mx-auto leading-relaxed`}
                style={{ fontStyle: 'italic' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {category.description}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Decorative Line Below */}
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="w-24 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          />

          <motion.div
            className="mx-3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ color: themeColors.accent }}
            >
              <BsStars className="w-3 h-3 opacity-60" />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-24 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeColors.bg} relative`}>
      {/* Floating Search Input */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {!showSearch ? (
          // Search Button
          <motion.button
            onClick={() => setShowSearch(true)}
            className={`${themeColors.card} p-3 rounded-full shadow-lg border-2 transition-all duration-300 hover:shadow-xl`}
            style={{
              borderColor: themeColors.primary + '30',
              boxShadow: `0 4px 20px ${themeColors.primary}20`
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `0 6px 25px ${themeColors.primary}30`,
              rotate: 5
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open search"
          >
            <FiSearch
              className="w-5 h-5"
              style={{ color: themeColors.primary }}
            />
          </motion.button>
        ) : (
          // Search Input
          <motion.div
            className={`${themeColors.card} rounded-full shadow-lg border-2 overflow-hidden`}
            style={{
              borderColor: themeColors.primary + '30',
              boxShadow: `0 4px 20px ${themeColors.primary}20`,
              minWidth: '280px'
            }}
            initial={{ width: 48, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center px-4 py-3">
              <FiSearch
                className="w-4 h-4 mr-3 flex-shrink-0"
                style={{ color: themeColors.primary }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className={`flex-1 bg-transparent outline-none text-sm ${themeColors.text} placeholder-opacity-60`}
                style={{ color: themeColors.text }}
                autoFocus
              />
              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm('')}
                  className={`ml-2 p-1 rounded-full transition-colors duration-200`}
                  style={{ color: themeColors.textMuted }}
                  whileHover={{
                    scale: 1.1,
                    color: themeColors.text
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Clear search"
                >
                  <FiX className="w-3 h-3" />
                </motion.button>
              )}
              <motion.button
                onClick={clearSearch}
                className={`ml-2 p-1 rounded-full transition-colors duration-200`}
                style={{ color: themeColors.textMuted }}
                whileHover={{
                  scale: 1.1,
                  color: themeColors.text
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close search"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Search Results Info */}
      {searchTerm && (
        <motion.div
          className="fixed top-20 right-4 z-40"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`${themeColors.card} px-3 py-2 rounded-lg shadow-md border text-xs`}
            style={{
              borderColor: themeColors.accent + '30',
              backgroundColor: themeColors.accent + '10'
            }}
          >
            <span className={themeColors.text}>
              {filteredCategories.reduce((total, cat) =>
                total + (cat.produits?.length || 0) + (cat.supplementaires?.length || 0), 0
              )} results found
            </span>
          </div>
        </motion.div>
      )}
      {/* Business Header */}
      <header className={`relative text-center py-16 px-4 ${themeColors.card} border-b ${themeColors.border} overflow-hidden`}>
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-8 p-8 rotate-12">
            {getFoodIcons().map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-2xl sm:text-3xl lg:text-4xl"
                style={{ color: themeColors.foodAccent }}
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [-20, -40, -20], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10" style={{ color: themeColors.coffeeAccent }}
          > <GiCoffeeCup className="text-4xl opacity-20" /> </motion.div>
          <motion.div
            animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 right-16" style={{ color: themeColors.accent }}
          > <GiChefToque className="text-5xl opacity-15" /> </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20" style={{ color: themeColors.foodAccent }}
          > <BsStars className="text-3xl opacity-20" /> </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10" style={{ color: themeColors.warmAccent }}
          > <GiCookingPot className="text-4xl opacity-15" /> </motion.div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 opacity-20"
                style={{ borderColor: themeColors.foodAccent, borderStyle: 'dashed' }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              {[GiKnifeFork, MdRestaurant, GiCupcake, FiCoffee].map((Icon, index) => (
                <motion.div
                  key={index}
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                  }}
                  className="absolute text-2xl opacity-30"
                  style={{
                    color: themeColors.accent,
                    transform: `rotate(${index * 90}deg) translateY(-80px) rotate(-${index * 90}deg)`
                  }}
                > <Icon /> </motion.div>
              ))}
            </div>
            {/* Business Logo - Optimized for 500x500px */}
            <motion.img
              src={business?.logo?.url} alt={business.nom}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto cursor-pointer shadow-2xl relative z-10"
              onClick={() => navigate(`/business-profile/${business._id}`)}
              style={{
                border: `4px solid ${themeColors.primary}`,
                boxShadow: `0 0 30px ${themeColors.primary}30, 0 0 60px ${themeColors.foodAccent}20`,
                aspectRatio: '1/1', // Perfect square for 500x500px images
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              whileHover={{ scale: 1.1, boxShadow: `0 0 40px ${themeColors.primary}50, 0 0 80px ${themeColors.foodAccent}30` }}
              whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}
              loading="lazy" // Optimize loading performance
            />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-6">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${themeColors.text} relative`}
                style={{ fontFamily: "'Inter', sans-serif", textShadow: `2px 2px 4px ${themeColors.foodAccent}20` }}>
              <span className="relative"> {business?.nom}
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${themeColors.foodAccent}, ${themeColors.accent}, ${themeColors.primary})` }}
                />
              </span>
            </h2>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ color: themeColors.foodAccent }}>
                <GiKnifeFork className="text-2xl opacity-60" />
              </motion.div>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.accent }}
                  />
                ))}
              </div>
              <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ color: themeColors.foodAccent }}>
                <GiKnifeFork className="text-2xl opacity-60 transform scale-x-[-1]" />
              </motion.div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-8">
            <p className={`text-xl md:text-2xl ${themeColors.textSecondary} max-w-3xl mx-auto leading-relaxed relative`}
               style={{ fontFamily: "'Inter', sans-serif", fontStyle: 'italic', fontWeight: '300' }}>
              <span className="absolute -left-4 -top-2 text-4xl opacity-30" style={{ color: themeColors.foodAccent }}>"</span>
              {business?.bio}
              <span className="absolute -right-4 -bottom-2 text-4xl opacity-30" style={{ color: themeColors.foodAccent }}>"</span>
            </p>
          </motion.div>
         
        </div>
      </header>




      {/* Products and Supplementaries */}
      <main className={`p-4 md:p-8 ${themeColors.bg} relative overflow-hidden`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-3 pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-10"
            style={{ color: themeColors.foodAccent }}
          >
            <GiChefToque className="text-8xl" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-10"
            style={{ color: themeColors.coffeeAccent }}
          >
            <GiCookingPot className="text-6xl" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ color: themeColors.accent }}
          >
            <BsStars className="text-4xl" />
          </motion.div>
        </div>

        {/* Menu Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: themeColors.accent }}
            >
              <GiKnifeFork className="text-2xl opacity-60" />
            </motion.div>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: themeColors.accent }}
                />
              ))}
            </div>
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: themeColors.accent }}
            >
              <GiKnifeFork className="text-2xl opacity-60 transform scale-x-[-1]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Display All Products Grouped by Category */}
        {filteredCategories.length === 0 && searchTerm ? (
          // No results found
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6"
                style={{ color: themeColors.textMuted }}
              >
                <FiSearch className="w-16 h-16 mx-auto" />
              </motion.div>
              <h3 className={`text-xl font-semibold ${themeColors.text} mb-2`}>
                No products found
              </h3>
              <p className={`${themeColors.textSecondary} mb-4`}>
                Try searching with different keywords or browse our categories
              </p>
              <motion.button
                onClick={clearSearch}
                className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg`}
                style={{ backgroundColor: themeColors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Search
              </motion.button>
            </div>
          </motion.div>
        ) : (
          filteredCategories.map(category => (
            <section key={category._id} className="mb-12">
              <CategoryHeader category={category} />

              {category.produits && category.produits.length > 0 && (
                <div className="mb-10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                    {category.produits.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onSelect={() => {
                          setSelectedProduct(product);
                          setModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {category.supplementaires && category.supplementaires.length > 0 && (
                <div className="mb-10">
                  <h3 className={`text-xl font-semibold ${themeColors.text} mb-6 pb-2 border-b-2 ${themeColors.border} relative`}
                      style={{ borderColor: themeColors.foodAccent }}>
                    Add-ons & Extras
                    <span className={`absolute -bottom-px left-0 w-1/4 h-0.5`} style={{backgroundColor: themeColors.foodAccent}}></span>
                    <span className={`ml-2 text-sm font-normal px-2 py-0.5 rounded-full ${themeColors.textSecondary}`}
                          style={{backgroundColor: themeColors.foodAccent + '20'}}>
                      ({category.supplementaires.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {category.supplementaires.map(supp => (
                      <SupplementaryCard key={supp._id} supplementary={supp} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))
        )}
      </main>

      {/* Enhanced Product Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
        closeAfterTransition
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '85%', md: '700px', lg: '800px' },
          maxWidth: '95vw',
          maxHeight: '95vh',
          overflowY: 'auto',
          bgcolor: 'transparent',
          outline: 'none',
        }}>
          {selectedProduct && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <button
                onClick={() => setModalOpen(false)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 z-20
                            ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} `}
                aria-label="Close modal"
              >
                <IoMdClose className={`w-6 h-6 ${themeColors.textSecondary} hover:${themeColors.text}`} />
              </button>

              {/* Modal Product Image - Optimized for 500x500px */}
              {selectedProduct.image?.url && (
                <div className="w-full max-w-md mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl border-2"
                     style={{
                       borderColor: themeColors.primary + '30',
                       boxShadow: `0 8px 32px ${themeColors.primary}20`
                     }}>
                  <div className="relative">
                    <img
                      src={selectedProduct.image.url}
                      alt={selectedProduct.nom}
                      className="w-full object-cover transition-transform duration-700 hover:scale-105"
                      style={{
                        aspectRatio: '1/1', // Perfect square for 500x500px images
                        objectFit: 'cover',
                        objectPosition: 'center',
                        height: 'auto'
                      }}
                      loading="lazy" // Optimize loading performance
                    />
                    {/* Image overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

                    {/* Floating food icon on image */}
                    <div className="absolute top-4 right-4 opacity-80">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
                        style={{ backgroundColor: themeColors.accent + '90' }}
                      >
                        <MdOutlineDinnerDining className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <h2 id="product-modal-title" className={`text-2xl sm:text-3xl font-bold mb-2 ${themeColors.text}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedProduct.nom}
              </h2>

              {selectedProduct.description && (
                <p id="product-modal-description" className={`text-sm sm:text-base ${themeColors.textSecondary} mb-4 leading-relaxed`}>
                  {selectedProduct.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className={`text-2xl sm:text-3xl font-bold`} style={{ color: themeColors.foodAccent }}>
                    {selectedProduct.promo_prix || selectedProduct.prix} DH
                  </span>
                  {selectedProduct.promo_prix && (
                    <span className={`text-md sm:text-lg ${themeColors.textMuted} line-through`}>
                      {selectedProduct.prix} DH
                    </span>
                  )}
                </div>
                {selectedProduct.promo_prix && (
                  <div
                    className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white"
                    style={{ backgroundColor: themeColors.warmAccent }}
                  >
                    PROMO
                  </div>
                )}
              </div>

              {/* Placeholder for more details if needed, e.g., ingredients or options */}
              {/*
              <div className={`mt-4 pt-4 border-t ${themeColors.border}`}>
                  <h3 className={`text-lg font-semibold ${themeColors.text} mb-2`}>More Info</h3>
                  // Add more details here
              </div>
              */}
            </motion.div>
          )}
        </Box>
      </Modal>

      {/* Footer with Contact and Social */}
      <footer className={`py-16 px-4 mt-12 ${themeColors.footer} border-t ${themeColors.border} relative overflow-hidden`}>
        {/* Footer Background Decorations */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 left-8"
            style={{ color: themeColors.foodAccent }}
          >
            <GiCoffeeCup className="text-6xl" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-8"
            style={{ color: themeColors.accent }}
          >
            <GiCupcake className="text-5xl" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            style={{ color: themeColors.coffeeAccent }}
          >
            <GiKnifeFork className="text-4xl" />
          </motion.div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* Footer Business Logo - Optimized for 500x500px */}
              {business?.logo?.url ? (
                <img
                  src={business.logo.url}
                  alt={business?.nom}
                  className="h-8 w-8 rounded-full object-cover"
                  style={{
                    aspectRatio: '1/1', // Perfect square for 500x500px images
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  loading="lazy" // Optimize loading performance
                />
              ) : (
                <div className={`h-8 w-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: themeColors.primary }}>
                  <span className="text-white font-bold text-sm"> {business?.nom?.charAt(0) || 'B'} </span>
                </div>
              )}
              <h3 className={`text-2xl font-bold ${themeColors.text}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {business?.nom || 'Business'}
              </h3>
            </div>
            <p className={`${themeColors.textMuted} max-w-md mx-auto`}>
              {business?.description ? business.description.substring(0, 100) + (business.description.length > 100 ? '...' : '') : 'Thank you for visiting our menu!'}
            </p>
          </div>
          {/* Contact Information with Enhanced Styling */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {(business.adress || business.ville) && (
              <div className="text-center md:text-left">
                <h4 className={`text-lg font-semibold mb-3 ${themeColors.text} flex items-center justify-center md:justify-start space-x-2`}>
                  <FiMapPin className="w-5 h-5" style={{ color: themeColors.accent }} />
                  <span>Location</span>
                </h4>
                <p className={`${themeColors.textSecondary}`}>
                  {business.adress && business.ville ? `${business.adress}, ${business.ville}` : business.adress || business.ville}
                </p>
              </div>
            )}
            {business.tele && (
              <div className="text-center md:text-right">
                <h4 className={`text-lg font-semibold mb-3 ${themeColors.text} flex items-center justify-center md:justify-end space-x-2`}>
                  <FiPhone className="w-5 h-5" style={{ color: themeColors.accent }} />
                  <span>Contact</span>
                </h4>
                <a href={`tel:${business.tele}`} className={`${themeColors.textSecondary} hover:underline transition-colors duration-200`}
                   style={{ color: themeColors.primary }}>
                  {business.tele}
                </a>
              </div>
            )}
          </motion.div>
          {menuData.socialMediaVisible && business.socialMedia && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h4 className={`text-lg font-semibold mb-6 ${themeColors.text} relative`}>
                <span className="relative">
                  Follow Us
                  {/* Decorative underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${themeColors.accent}, ${themeColors.primary})`,
                      width: "60px"
                    }}
                  />
                </span>
              </h4>
              <div className="flex justify-center space-x-4 flex-wrap gap-2">
                {Object.entries(business.socialMedia).map(([platform, link], index) => {
                  if (link) {
                    return (
                      <motion.a
                        key={platform}
                        href={platform === 'whatsapp' ? `https://wa.me/${link}` : link}
                        target="_blank" rel="noopener noreferrer"
                        className={`p-4 rounded-full transition-all duration-300 shadow-lg relative overflow-hidden group`}
                        style={{
                          backgroundColor: themeColors.primary + '20',
                          border: `2px solid ${themeColors.primary}30`
                        }}
                        title={`Follow us on ${platform}`}
                        whileHover={{
                          scale: 1.15,
                          y: -5,
                          boxShadow: `0 8px 25px ${themeColors.primary}30`
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1
                        }}
                      >
                        {/* Background animation on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-transform duration-700 -translate-x-full group-hover:translate-x-full`} />

                        <motion.div
                          style={{ color: themeColors.primary }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {getSocialIcon(platform)}
                        </motion.div>

                        {/* Floating indicator */}
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: themeColors.accent }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.a>
                    );
                  }
                  return null;
                })}
              </div>
            </motion.div>
          )}
          {/* Footer Bottom with Enhanced Styling */}
          <motion.div
            className={`text-center mt-12 pt-8 border-t ${themeColors.border} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Decorative elements */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: themeColors.accent }}
              >
                <GiKnifeFork className="text-lg opacity-40" />
              </motion.div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: themeColors.accent }}
                  />
                ))}
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: themeColors.accent }}
              >
                <GiKnifeFork className="text-lg opacity-40 transform scale-x-[-1]" />
              </motion.div>
            </div>

            <motion.p
              className={`${themeColors.textMuted} text-sm relative`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              © {new Date().getFullYear()} {business?.nom || 'Business'}. All rights reserved.
              {/* Decorative heart */}
              <motion.span
                className="inline-block ml-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: themeColors.warmAccent }}
              >
                ♥
              </motion.span>
            </motion.p>

            {/* Powered by section */}
            <motion.p
              className={`${themeColors.textMuted} text-xs mt-2 opacity-60`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              Crafted with passion for great food experiences
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default DynamicTemplate;