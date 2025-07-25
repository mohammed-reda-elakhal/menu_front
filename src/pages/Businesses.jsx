import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBusinesses } from '../redux/apiCalls/businessApiCalls';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';
import {
  FiGlobe,
  FiSearch,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiFilter,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiThumbsUp,
  FiRefreshCw,
  FiStar
} from 'react-icons/fi';
import { MdQrCode2 } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import logo from '../assets/menu.png';
import Header from '../components/Header';
import Footer from './../components/Footer';
// Import Masonry component
import Masonry from 'react-masonry-css';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Paper,
  Skeleton
} from '@mui/material';

const Businesses = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [isOpen, setIsOpen] = useState(null); // null = all, true = open, false = closed
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filterType || filterCity || isOpen !== null;

  const { businesses, loading, error, pagination } = useSelector(state => state.business);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); // Increased page size for better masonry layout

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 4, // Default to 4 columns
    1280: 4,    // 4 columns for xl screens
    1024: 3,    // 3 columns for lg screens
    768: 2,     // 2 columns for md screens
    640: 2,     // 2 columns for sm screens
    480: 1      // 1 column for xs screens
  };



  // Fetch businesses with pagination
  useEffect(() => {
    setIsFiltering(true);
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      type: filterType || undefined,
      ville: filterCity || undefined
    };

    dispatch(getAllBusinesses(params))
      .then(() => setIsFiltering(false))
      .catch(() => setIsFiltering(false));
  }, [dispatch, currentPage, pageSize, searchTerm, filterType, filterCity]);

  // Extract unique business types and cities for filters
  const businessTypes = [...new Set(businesses?.map(business => business.type) || [])].filter(Boolean);
  const businessCities = [...new Set(businesses?.map(business => business.ville) || [])].filter(Boolean);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleCityChange = (e) => {
    setFilterCity(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleOpenStatusChange = (e) => {
    if (e.target.value === '') setIsOpen(null);
    else if (e.target.value === 'open') setIsOpen(true);
    else setIsOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterCity('');
    setIsOpen(null);
    setCurrentPage(1);

    // Focus on search input after clearing
    if (searchRef.current) {
      searchRef.current.value = '';
      searchRef.current.focus();
    }
  };

  // Filter businesses by open/closed status (client-side filtering)
  const filteredByOpenStatus = businesses?.filter(business => {
    return isOpen === null || business.isOpen === isOpen;
  });

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 -left-4 w-64 h-64 rounded-full blur-[80px] transition-colors duration-300 ${darkMode ? 'bg-primary/10' : 'bg-blue-500/10'}`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[80px] transition-colors duration-300 ${darkMode ? 'bg-primary/10' : 'bg-blue-500/10'}`} />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto p-3 sm:p-4 lg:p-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center relative"
        >
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('businesses.title') || 'Discover Businesses'}
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('businesses.description') || 'Explore our collection of businesses and their menus'}
          </p>

          {/* Refresh Button */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
                duration: 0.4
              }}
              onClick={() => {
                setIsFiltering(true);
                dispatch(getAllBusinesses({
                  page: currentPage,
                  limit: pageSize,
                  search: searchTerm || undefined,
                  type: filterType || undefined,
                  ville: filterCity || undefined
                }))
                .then(() => setIsFiltering(false))
                .catch(() => setIsFiltering(false));
              }}
              disabled={isFiltering}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                darkMode
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              } ${isFiltering ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label="Refresh businesses"
            >
              <FiRefreshCw className={`w-5 h-5 ${isFiltering ? 'animate-spin' : ''}`} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Toggle */}
            <div className="flex gap-2">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t('businesses.searchPlaceholder') || 'Search businesses...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`w-full border rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 transition-colors duration-300
                    ${darkMode
                      ? 'bg-secondary1/50 border-primary/20 text-white placeholder-gray_bg focus:ring-primary/50'
                      : 'bg-white border-blue-200 text-gray-800 placeholder-gray-400 focus:ring-blue-400/50'}`}
                />
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-400'}`} />
              </div>

              {/* Filter Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300
                  ${darkMode
                    ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                    : 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200'}`}
              >
                <FiFilter className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businesses.filters.title')}</span>
                <motion.span
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.span>
              </motion.button>

              {/* Clear Filters Button - Only show when filters are active */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300
                    ${darkMode
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                      : 'bg-red-100 border-red-200 text-red-600 hover:bg-red-200'}`}
                >
                  <FiX className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('businesses.filters.clear')}</span>
                </motion.button>
              )}
            </div>

            {/* Filters Panel - Collapsible */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-lg border
                    ${darkMode
                      ? 'bg-secondary1/30 border-primary/20'
                      : 'bg-white/80 border-blue-200'}`}>
                    {/* Type Filter */}
                    <div className="relative">
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                        {t('businesses.filters.typeLabel')}
                      </label>
                      <select
                        value={filterType}
                        onChange={handleTypeChange}
                        className={`w-full appearance-none border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 transition-colors duration-300
                          ${darkMode
                            ? 'bg-secondary1/50 border-primary/20 text-white focus:ring-primary/50'
                            : 'bg-white border-blue-200 text-gray-800 focus:ring-blue-400/50'}`}
                      >
                        <option value="">{t('businesses.filters.allTypes') || 'All Types'}</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <FiFilter className={`absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 pointer-events-none transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-400'}`} />
                    </div>

                    {/* City Filter */}
                    <div className="relative">
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                        {t('businesses.filters.cityLabel')}
                      </label>
                      <select
                        value={filterCity}
                        onChange={handleCityChange}
                        className={`w-full appearance-none border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 transition-colors duration-300
                          ${darkMode
                            ? 'bg-secondary1/50 border-primary/20 text-white focus:ring-primary/50'
                            : 'bg-white border-blue-200 text-gray-800 focus:ring-blue-400/50'}`}
                      >
                        <option value="">{t('businesses.filters.allCities') || 'All Cities'}</option>
                        {businessCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <FiMapPin className={`absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 pointer-events-none transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-400'}`} />
                    </div>

                    {/* Open/Closed Filter */}
                    <div className="relative">
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                        {t('businesses.filters.statusLabel')}
                      </label>
                      <select
                        value={isOpen === null ? '' : isOpen ? 'open' : 'closed'}
                        onChange={handleOpenStatusChange}
                        className={`w-full appearance-none border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 transition-colors duration-300
                          ${darkMode
                            ? 'bg-secondary1/50 border-primary/20 text-white focus:ring-primary/50'
                            : 'bg-white border-blue-200 text-gray-800 focus:ring-blue-400/50'}`}
                      >
                        <option value="">{t('businesses.filters.allStatus') || 'All Status'}</option>
                        <option value="open">{t('businesses.filters.openNow') || 'Open Now'}</option>
                        <option value="closed">{t('businesses.filters.closed') || 'Closed'}</option>
                      </select>
                      <FiClock className={`absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 pointer-events-none transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex flex-wrap gap-2 text-sm ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}
              >
                <span>{t('businesses.filters.activeFilters')}</span>
                {searchTerm && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {t('businesses.filters.search')}: {searchTerm}
                  </span>
                )}
                {filterType && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {t('businesses.filters.type')}: {filterType}
                  </span>
                )}
                {filterCity && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    darkMode ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {t('businesses.filters.city')}: {filterCity}
                  </span>
                )}
                {isOpen !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isOpen
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {isOpen
                      ? t('businesses.filters.openNow')
                      : t('businesses.filters.closed')
                    }
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Loading State - Skeleton Cards */}
        {loading && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {Array.from(new Array(8)).map((_, index) => (
              <div key={index} className="mb-4">
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: '100%',
                    backgroundColor: darkMode ? 'rgba(10, 12, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: darkMode ? '1px solid rgba(55, 104, 229, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Business Info with Circle Image Skeleton */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {/* Circle Image Skeleton */}
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Skeleton
                          variant="circular"
                          width={70}
                          height={70}
                          animation="wave"
                          sx={{
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                        />
                        {/* Status indicator skeleton */}
                        <Skeleton
                          variant="circular"
                          width={18}
                          height={18}
                          animation="wave"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </Box>

                      {/* Business Info Skeleton */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton
                          variant="text"
                          width="90%"
                          height={32}
                          animation="wave"
                          sx={{
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                            mb: 1
                          }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width="40%"
                          height={24}
                          animation="wave"
                          sx={{
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                            mb: 1,
                            borderRadius: 1
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="60%"
                          height={20}
                          animation="wave"
                          sx={{
                            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Ratings Skeleton */}
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={24}
                      animation="wave"
                      sx={{
                        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        mb: 2
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        animation="wave"
                        sx={{
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        animation="wave"
                        sx={{
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Masonry>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                maxWidth: '500px',
                backgroundColor: darkMode ? 'rgba(10, 12, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: darkMode ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.1)',
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FiAlertCircle className="text-red-500 text-4xl mb-4 mx-auto" />
              </motion.div>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: darkMode ? '#f87171' : '#ef4444',
                  fontWeight: 600
                }}
              >
                Failed to load businesses
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  mb: 3
                }}
              >
                {error}
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Box
                  component="button"
                  onClick={() => dispatch(getAllBusinesses({ page: 1, limit: pageSize }))}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mx: 'auto',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.2)' : 'rgba(55, 104, 229, 0.1)',
                    color: '#3768e5',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.3)' : 'rgba(55, 104, 229, 0.2)',
                    }
                  }}
                >
                  <FiRefreshCw size={16} />
                  Try Again
                </Box>
              </motion.div>
            </Paper>
          </motion.div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredByOpenStatus?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                maxWidth: '500px',
                backgroundColor: darkMode ? 'rgba(10, 12, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: darkMode ? '1px solid rgba(55, 104, 229, 0.2)' : '1px solid rgba(55, 104, 229, 0.1)',
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(55, 104, 229, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <FiSearch className="text-primary text-4xl" />
                </Box>
              </motion.div>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: darkMode ? 'white' : 'text.primary',
                  fontWeight: 600
                }}
              >
                {t('businesses.noResults.title') || 'No businesses found'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  mb: 3
                }}
              >
                {t('businesses.noResults.description') || 'Try adjusting your filters or search terms'}
              </Typography>
              {hasActiveFilters && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box
                    component="button"
                    onClick={clearFilters}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mx: 'auto',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.2)' : 'rgba(55, 104, 229, 0.1)',
                      color: '#3768e5',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.3)' : 'rgba(55, 104, 229, 0.2)',
                      }
                    }}
                  >
                    <FiX size={16} />
                    {t('businesses.filters.clear')}
                  </Box>
                </motion.div>
              )}
            </Paper>
          </motion.div>
        )}

        {/* Businesses Grid - Masonry Layout */}
        {!loading && !error && filteredByOpenStatus?.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {filteredByOpenStatus.map((business) => (
              <div key={business._id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: '100%',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      backgroundColor: darkMode ? 'rgba(10, 12, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      border: darkMode ? '1px solid rgba(55, 104, 229, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: darkMode
                        ? '0 4px 20px rgba(0, 0, 0, 0.25)'
                        : '0 4px 20px rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        boxShadow: darkMode
                          ? '0 8px 25px rgba(55, 104, 229, 0.15)'
                          : '0 8px 25px rgba(0, 0, 0, 0.1)',
                        border: darkMode
                          ? '1px solid rgba(55, 104, 229, 0.2)'
                          : '1px solid rgba(55, 104, 229, 0.15)',
                      }
                    }}
                  >
                    {/* Status Badge - Open/Closed */}


                    <CardContent sx={{ p: 2.5 }}>
                      {/* Business Info with Circle Image */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {/* Circle Image */}
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                          <Avatar
                            src={business.logo?.url || 'https://via.placeholder.com/300'}
                            alt={business.nom}
                            sx={{
                              width: 70,
                              height: 70,
                              border: darkMode ? '2px solid rgba(55, 104, 229, 0.2)' : '2px solid rgba(55, 104, 229, 0.1)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
                              }
                            }}
                          />
                          {/* Small status indicator */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              backgroundColor: business.isOpen ? '#10b981' : '#ef4444',
                              border: '2px solid',
                              borderColor: darkMode ? 'rgba(10, 12, 44, 0.8)' : 'white',
                            }}
                          />
                        </Box>

                        {/* Business Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Business Name */}
                          <Typography
                            variant="h6"
                            component="div"
                            noWrap
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              color: darkMode ? 'white' : 'black'
                            }}
                          >
                            {business.nom}
                          </Typography>

                          {/* Business Type */}
                          <Chip
                            label={business.type}
                            size="small"
                            sx={{
                              mb: 1,
                              backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.2)' : 'rgba(55, 104, 229, 0.1)',
                              color: darkMode ? '#3768e5' : '#3768e5',
                              fontWeight: 500,
                              borderRadius: '8px'
                            }}
                          />

                          {/* Location */}
                          {business.ville && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: darkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                                fontSize: '0.8rem'
                              }}
                            >
                              <FiMapPin style={{ marginRight: 4 }} size={14} />
                              {business.ville}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Ratings */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                        }}
                      >
                        <FiThumbsUp size={14} style={{ marginRight: 4 }} />
                        <Typography variant="body2" component="span">
                          {business.ratings?.positive || 0} {t('businesses.positiveRatings')}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 'auto'
                        }}
                      >
                        {/* View Profile Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Box
                            component={Link}
                            to={`/business-profile/${business._id}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: '#3768e5',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            <FiUser size={16} />
                            {t('business.settings.viewProfile')}
                          </Box>
                        </motion.div>

                        {/* Menu Button - Only if menu code exists */}
                        {business.menu_code && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Box
                              component={Link}
                              to={`/menu/${business.menu_code}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: darkMode ? '#757de8' : '#5c6bc0',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              <MdQrCode2 size={16} />
                              {t('businessProfile.openMenu')}
                            </Box>
                          </motion.div>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Masonry>
        )}

        {/* Pagination */}
        {!loading && !error && filteredByOpenStatus?.length > 0 && pagination && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-2">
              {/* Previous Page Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                  pagination.hasPrevPage
                    ? darkMode
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : darkMode
                      ? 'bg-gray-700/20 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show current page, first page, last page, and pages around current page
                    const currentPage = pagination.currentPage;
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis between non-consecutive pages
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-500'}`}>...</span>
                        )}

                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            page === pagination.currentPage
                              ? darkMode ? 'bg-primary text-white' : 'bg-blue-500 text-white'
                              : darkMode
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {page}
                        </button>

                        {showEllipsisAfter && (
                          <span className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-500'}`}>...</span>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Next Page Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNextPage}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                  pagination.hasNextPage
                    ? darkMode
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : darkMode
                      ? 'bg-gray-700/20 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Businesses;
