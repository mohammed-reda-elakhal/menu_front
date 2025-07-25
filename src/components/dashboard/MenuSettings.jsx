import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit, FiSave, FiX, FiEye, FiEyeOff, FiGlobe, FiInfo, FiTag, FiPlus, FiCopy, FiCheck, FiDownload, FiShare2, FiExternalLink, FiLayout, FiPackage, FiGrid } from 'react-icons/fi';
import { getMenusByBusiness, updateMenu, toggleMenuPublish, toggleMenuSocialMediaVisible } from '../../redux/apiCalls/menuApiCalls';
import LoadingSpinner from '../LoadingSpinner';
import CreateMenuModal from '../modals/CreateMenuModal';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const MenuSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Get selected business from Redux
  const { selectedBusiness } = useSelector(state => state.business);

  // Get menu states from Redux
  const { menusByBusiness, loading, error } = useSelector(state => state.menu);

  // Local state for menu data
  const [menuInfo, setMenuInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrSize = 180;
  const [qrDownloading, setQrDownloading] = useState(false);
  const qrRef = useRef(null);

  // Fetch menu data when component mounts or selected business changes
  useEffect(() => {
    if (selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  // Update local state when menu data changes
  useEffect(() => {
    if (menusByBusiness && menusByBusiness.length > 0) {
      setMenuInfo(menusByBusiness[0]); // Assuming the first menu is the one we want to display
    }
  }, [menusByBusiness]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    let timer;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      title: menuInfo.title,
      description: menuInfo.description
    };

    // Immediately switch to view mode and update directly
    setEditMode(false);
    dispatch(updateMenu(menuInfo._id, updateData))
      .then(result => {
        if (result.success) {
          setSuccessMessage(t('dashboard.menu.settings.updateSuccess') || 'Menu updated successfully');
          setShowSuccessMessage(true);
        }
      });
  };

  // Handle cancel edit
  const handleCancel = () => {
    // Reset form to original data
    if (menusByBusiness && menusByBusiness.length > 0) {
      setMenuInfo(menusByBusiness[0]);
    }

    // Exit edit mode
    setEditMode(false);
  };

  // Toggle publish status
  const handleTogglePublish = () => {
    dispatch(toggleMenuPublish(menuInfo._id))
      .then(result => {
        if (result.success) {
          setSuccessMessage(t('dashboard.menu.settings.publishToggleSuccess') || 'Menu publish status toggled successfully');
          setShowSuccessMessage(true);
        }
      });
  };

  // Toggle social media visibility
  const handleToggleSocialMedia = () => {
    dispatch(toggleMenuSocialMediaVisible(menuInfo._id))
      .then(result => {
        if (result.success) {
          setSuccessMessage(t('dashboard.menu.settings.socialMediaToggleSuccess') || 'Social media visibility toggled successfully');
          setShowSuccessMessage(true);
        }
      });
  };

  const handleCopyCode = async () => {
    if (menuInfo?.code_menu) {
      try {
        await navigator.clipboard.writeText(menuInfo.code_menu);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Show message if no menu is found
  if (!menuInfo) {
    return (
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300">
        <div className="text-center py-8 sm:py-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 sm:p-8 mb-6 inline-block max-w-lg mx-auto w-full">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-6">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-500 opacity-20"
                />
                <svg className="w-full h-full text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('dashboard.menu.settings.noMenuTitle') || 'No Menu Found'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto text-sm sm:text-base">
                  {t('dashboard.menu.settings.noMenu') || 'No menu found for this business. Create your first menu to get started.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm sm:text-base font-medium"
                >
                  <FiPlus className="w-5 h-5" />
                  {t('dashboard.menu.settings.createMenu') || 'Create Menu'}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CreateMenuModal with adjusted styles */}
        <CreateMenuModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            if (selectedBusiness && selectedBusiness._id) {
              dispatch(getMenusByBusiness(selectedBusiness._id));
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
          contentClassName="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-auto transform transition-all duration-300"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
            {t('dashboard.menu.settings.title') || 'Menu Settings'}
          </h2>

          {!editMode ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-primary rounded-xl text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">{t('dashboard.menu.settings.edit') || 'Edit'}</span>
            </motion.button>
          ) : (
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-green-500 rounded-xl text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300"
              >
                <FiSave className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">{t('dashboard.menu.settings.save') || 'Save'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-red-500 rounded-xl text-white shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">{t('dashboard.menu.settings.cancel') || 'Cancel'}</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border bg-green-50 border-green-200 text-green-700"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Menu Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Menu Avatar */}
              <div className="relative mb-4 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-primary to-secondary2 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                    {menuInfo?.title ? menuInfo.title.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border-2 border-primary">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <FiGlobe className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Menu Title and Status Tags */}
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white text-center bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
                {menuInfo?.title}
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-2">
                {/* Status Tags */}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium shadow-sm ${
                    menuInfo?.publier
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                  {menuInfo?.publier ? t('Published') : t('Unpublished')}
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 text-xs sm:text-sm rounded-full font-medium shadow-sm bg-blue-100 text-blue-700 border border-blue-200">
                  {menuInfo?.code_menu ? 'Active' : 'Inactive'}
                </motion.span>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 mt-4">
                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: menuInfo?.title || 'Menu',
                        text: menuInfo?.description || 'Check out my menu!',
                        url: `${window.location.origin}/menu/${menuInfo?.code_menu}`
                      })
                      .catch(err => console.error('Error sharing:', err));
                    } else {
                      // Fallback to copy link
                      navigator.clipboard.writeText(`${window.location.origin}/menu/${menuInfo?.code_menu}`);
                      setSuccessMessage(t('Link copied to clipboard'));
                      setShowSuccessMessage(true);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300"
                >
                  <FiShare2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {t('Share Menu Link')}
                  </span>
                </motion.button>

                {/* Publish Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTogglePublish}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 ${
                    menuInfo?.publier
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {menuInfo?.publier ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {menuInfo?.publier ? t('Unpublish Menu') : t('Publish Menu')}
                  </span>
                </motion.button>

                {/* Social Media Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleSocialMedia}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-300 ${
                    menuInfo?.socialMediaVisible
                      ? 'bg-gray-500 hover:bg-gray-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <FiGlobe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {menuInfo?.socialMediaVisible ? t('Hide Social Media') : t('Show Social Media')}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Template Info Card */}
              {menuInfo?.template && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <FiLayout className="w-5 h-5 text-primary" />
                      {t('Template Information')}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      menuInfo.template.isFree 
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                      {menuInfo.template.isFree ? 'Free' : 'Premium'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Template Name</h4>
                        <p className="text-gray-800 dark:text-white">{menuInfo.template.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                        <p className="text-gray-800 dark:text-white">{menuInfo.template.category}</p>
                      </div>
                     
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={menuInfo.template.demoPath}
                          target="_blank"
                          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <FiGrid className="w-4 h-4" />
                          View Demo
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Section - Moved from left column */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <FiPackage className="w-5 h-5 text-primary" />
                    {t('QR Code & Sharing')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-inner border border-gray-100">
                      <QRCodeSVG
                        ref={qrRef}
                        value={`${window.location.origin}/menu/${menuInfo?.code_menu}`}
                        size={qrSize}
                        bgColor={"#ffffff"}
                        fgColor={"#3768e5"}
                        level={"H"}
                        margin={10}
                      />
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setQrDownloading(true);
                          const svg = qrRef.current;
                          const svgData = new XMLSerializer().serializeToString(svg);
                          const canvas = document.createElement("canvas");
                          const ctx = canvas.getContext("2d");
                          const img = new Image();
                          img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.fillStyle = "white";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                            const pngFile = canvas.toDataURL("image/png");
                            const downloadLink = document.createElement("a");
                            downloadLink.download = `${menuInfo?.code_menu || 'menu'}_qr.png`;
                            downloadLink.href = pngFile;
                            downloadLink.click();
                            setQrDownloading(false);
                          };
                          img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-500"
                        title="Download QR Code"
                      >
                        {qrDownloading ?
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> :
                          <FiDownload className="w-5 h-5" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopyCode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-500"
                        title="Copy Menu Code"
                      >
                        {copied ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Links and Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Menu URL
                      </label>
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800">
                        <code className="text-sm font-mono text-primary truncate">
                          {`${window.location.origin}/menu/${menuInfo?.code_menu}`}
                        </code>
                        <Link
                          to={`/menu/${menuInfo?.code_menu}`}
                          target="_blank"
                          className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Menu Code
                      </label>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800">
                        <code className="text-sm font-mono text-primary">
                          {menuInfo?.code_menu}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.menu.settings.menuTitle') || 'Menu Title'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiTag className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={menuInfo?.title}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder={t('dashboard.menu.settings.menuTitlePlaceholder') || 'Enter menu title'}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                          ${editMode
                            ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                          focus:ring-2 focus:ring-primary/20 focus:border-primary
                          text-gray-800 dark:text-white transition-all duration-300
                          placeholder-gray-400 text-base
                          hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                          shadow-sm hover:shadow-md group-hover:shadow-lg`}
                      />
                    </div>
                  </motion.div>

                  <motion.div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('dashboard.menu.settings.menuDescription') || 'Menu Description'}
                    </label>
                    <div className="relative group">
                      <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                        <FiInfo className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <textarea
                        name="description"
                        value={menuInfo?.description}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows="4"
                        placeholder={t('dashboard.menu.settings.menuDescriptionPlaceholder') || 'Enter menu description'}
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                          ${editMode
                            ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                          focus:ring-2 focus:ring-primary/20 focus:border-primary
                          text-gray-800 dark:text-white transition-all duration-300
                          placeholder-gray-400 text-base
                          hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                          shadow-sm hover:shadow-md group-hover:shadow-lg`}
                      />
                    </div>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSettings;
