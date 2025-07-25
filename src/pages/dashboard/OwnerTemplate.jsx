import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Masonry from 'react-masonry-css';
import {
  FiLayout,
  FiGrid,
  FiExternalLink,
  FiMenu,
  FiRefreshCw,
  FiCheck,
  FiSearch,
  FiX,
  FiStar,
  FiTag,
  FiLoader
} from 'react-icons/fi';
import { getMenusByBusiness, updateMenuTemplate } from '../../redux/apiCalls/menuApiCalls';
import { getPublishedTemplates } from '../../redux/apiCalls/templateApiCalls';
import LoadingSpinner from '../../components/LoadingSpinner';
// Removed: import { Template } from '../../types/template';

const CARD_IMAGE_HEIGHT = '160px';

// Masonry breakpoints for responsive design
const breakpointColumns = {
  default: 4, // 4 cards per row on large screens
  1400: 3,    // 3 cards per row on medium-large screens
  1100: 2,    // 2 cards per row on medium screens
  768: 1      // 1 card per row on mobile
};

// Add CSS styles for masonry layout
const masonryStyles = `
  .my-masonry-grid {
    display: flex;
    margin-left: -20px; /* gutter size offset */
    width: auto;
  }
  .my-masonry-grid_column {
    padding-left: 20px; /* gutter size */
    background-clip: padding-box;
  }
  
  /* Optional: different gutter size on mobile */
  @media (max-width: 768px) {
    .my-masonry-grid {
      margin-left: -15px;
    }
    .my-masonry-grid_column {
      padding-left: 15px;
    }
  }
`;

const OwnerTemplate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { selectedBusiness } = useSelector((state) => state.business);
  const { menusByBusiness, loading, error } = useSelector((state) => state.menu);
  const { templates, loading: templatesLoading } = useSelector((state) => state.template);

  const [menuInfo, setMenuInfo] = useState(null);
  const [updatingTemplateId, setUpdatingTemplateId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  useEffect(() => {
    dispatch(getPublishedTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (menusByBusiness && menusByBusiness.length > 0) {
      setMenuInfo(menusByBusiness[0]);
    } else {
      setMenuInfo(null);
    }
  }, [menusByBusiness]);

  const handleTemplateUpdate = async (templateId) => {
    if (!templateId || !menuInfo) return;

    setUpdatingTemplateId(templateId);
    setUpdateMessage('');

    try {
      const result = await dispatch(updateMenuTemplate(menuInfo._id, templateId));

      if (result.success) {
        setUpdateMessage(t('Template updated successfully!') || 'Template updated successfully!');
        if (selectedBusiness && selectedBusiness._id) {
            dispatch(getMenusByBusiness(selectedBusiness._id));
        }
      } else {
        setUpdateMessage(`${t('Error')}: ${result.error || t('Failed to update template.')}`);
      }
    } catch (err) {
      setUpdateMessage(`${t('Failed to update template')}: ${err.message || t('Unknown error')}`);
    } finally {
      setUpdatingTemplateId(null);
    }
  };

  useEffect(() => {
    if (updateMessage && !updateMessage.toLowerCase().includes(t('error').toLowerCase()) && !updateMessage.toLowerCase().includes(t('failed').toLowerCase())) {
      const timer = setTimeout(() => {
        setUpdateMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateMessage, t]);

  const sortedDisplayTemplates = useMemo(() => {
    if (!templates || templates.length === 0) {
      return [];
    }

    let displayTemplatesList = [...templates];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      displayTemplatesList = displayTemplatesList.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        (template.category && template.category.toLowerCase().includes(searchLower)) ||
        (template.description && template.description.toLowerCase().includes(searchLower))
      );
    }

    if (menuInfo && menuInfo.template && menuInfo.template._id) {
      const currentTemplateId = menuInfo.template._id;
      const currentIndex = displayTemplatesList.findIndex(t => t._id === currentTemplateId);

      if (currentIndex > -1) {
        const currentTemplateItem = displayTemplatesList.splice(currentIndex, 1)[0];
        displayTemplatesList.unshift(currentTemplateItem);
      }
    }
    return displayTemplatesList;
  }, [templates, menuInfo, searchTerm]);

  if (loading && !menusByBusiness) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">{t('Error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <style>{masonryStyles}</style>
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
            {t('dashboard.ownerTemplate.title')}
          </h2>

          <button
            onClick={() => {
              if (selectedBusiness && selectedBusiness._id) {
                dispatch(getMenusByBusiness(selectedBusiness._id));
                dispatch(getPublishedTemplates());
              }
            }}
            disabled={loading || templatesLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={`w-4 h-4 ${(loading || templatesLoading) ? 'animate-spin' : ''}`} />
            {(loading || templatesLoading) ? t('Refreshing...') : t('Refresh Data')}
          </button>
        </motion.div>

        {menuInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-4 sm:p-6 border border-green-100 dark:border-green-800/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-2 sm:mb-0">
                  <FiMenu className="w-5 h-5 text-primary" />
                  {t('Menu Information')}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    menuInfo.active
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30'
                      : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'
                  }`}>
                    {menuInfo.active ? t('Active') : t('Inactive')}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    menuInfo.publier
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                  }`}>
                    {menuInfo.publier ? t('Published') : t('Draft')}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p className="text-slate-600 dark:text-slate-300"><strong className="font-medium text-slate-700 dark:text-slate-200">{t('Menu Title')}:</strong> {menuInfo.title}</p>
                 {menuInfo.template ? (
                    <p className="text-slate-600 dark:text-slate-300">
                        <strong className="font-medium text-slate-700 dark:text-slate-200">{t('Current Template')}:</strong> {menuInfo.template.name}
                    </p>
                    ) : (
                    <p className="text-slate-600 dark:text-slate-300">
                        <strong className="font-medium text-slate-700 dark:text-slate-200">{t('Current Template')}:</strong> {t('None selected')}
                    </p>
                )}
              </div>

              {menuInfo.code_menu && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('Menu URL')}
                  </h4>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <p className="text-sm font-mono text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700/80 px-3 py-2 rounded-md flex-1 break-all select-all">
                      {`${window.location.origin}/menu/${menuInfo.code_menu}`}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/menu/${menuInfo.code_menu}`);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      {t('Copy URL')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {menuInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-100 dark:border-blue-800/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <FiGrid className="w-5 h-5 text-primary" />
                  {t('Available Templates')}
                </h3>
                <div className="w-full sm:w-auto sm:max-w-xs">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('Search templates...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label={t('Clear search')}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {searchTerm && sortedDisplayTemplates.length > 0 && (
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    {t('Showing {{count}} template(s) matching your search.', { count: sortedDisplayTemplates.length })}
                  </p>
              )}

              {templatesLoading ? (
                <div className="text-center py-12">
                  <FiLoader className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{t('Loading templates...')}</p>
                </div>
              ) : sortedDisplayTemplates && sortedDisplayTemplates.length > 0 ? (
                <Masonry
                  breakpointCols={breakpointColumns}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {sortedDisplayTemplates.map((template, index) => {
                    const isCurrent = menuInfo.template && menuInfo.template._id === template._id;
                    const isUpdatingThis = updatingTemplateId === template._id;

                    let cardClasses = `group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl border transition-all duration-300 ease-in-out hover:-translate-y-1 overflow-hidden mb-5 `;
                    if (isCurrent) {
                        cardClasses += `border-2 border-green-500 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20`;
                    } else {
                        cardClasses += `border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/40`;
                    }

                    return (
                      <motion.div
                        key={template._id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cardClasses}
                      >
                        <div className="relative p-2">
                            <div className={`relative overflow-hidden rounded-lg h-[${CARD_IMAGE_HEIGHT}] bg-slate-100 dark:bg-slate-700`}>
                            {template.imagePreview?.url ? (
                                <img
                                src={template.imagePreview.url}
                                alt={template.name}
                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                <FiLayout className="w-12 h-12" />
                                </div>
                            )}
                             {template.demoPath && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <a
                                    href={template.demoPath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors"
                                >
                                    <FiExternalLink size={14} />
                                    <span>{t('View Demo')}</span>
                                </a>
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow p-4 pt-2">
                          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={template.name}>
                            {template.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed h-[2.25rem]">
                            {template.description || t('No description available.')}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {template.category && (
                                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isCurrent ? 'bg-green-200/50 dark:bg-green-700/40 text-green-700 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'}`}>
                                <FiTag size={12} />
                                <span>{template.category}</span>
                                </div>
                            )}
                            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                template.isFree
                                ? (isCurrent ? 'bg-green-200/50 dark:bg-green-700/40 text-green-700 dark:text-green-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300')
                                : (isCurrent ? 'bg-purple-200/50 dark:bg-purple-700/40 text-purple-700 dark:text-purple-300' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300')
                            }`}>
                                <FiStar size={12} />
                                <span>{template.isFree ? t('Free') : t('Premium')}</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700/70">
                            <div className="flex gap-2 items-center">
                              {template.demoPath && (
                                <a
                                  href={template.demoPath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 border border-primary/50 dark:border-primary/70 text-primary dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary dark:focus:ring-offset-slate-800"
                                  title={t('View Demo')}
                                >
                                  <FiExternalLink size={14} />
                                  <span>{t('Demo')}</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => handleTemplateUpdate(template._id)}
                                disabled={isUpdatingThis || isCurrent || (updatingTemplateId !== null && updatingTemplateId !== template._id)}
                                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-800
                                  ${isCurrent
                                    ? 'bg-green-600 dark:bg-green-700 text-white cursor-default focus:ring-green-500'
                                    : isUpdatingThis
                                      ? 'bg-primary/70 dark:bg-primary/60 text-white cursor-wait focus:ring-primary'
                                      : 'bg-primary hover:bg-primary/90 text-white focus:ring-primary disabled:opacity-60 disabled:bg-slate-400 dark:disabled:bg-slate-600'
                                  }
                                  ${(updatingTemplateId !== null && updatingTemplateId !== template._id && !isCurrent) ? 'opacity-60 cursor-not-allowed' : '' }
                                `}
                              >
                                {isUpdatingThis ? <FiLoader size={14} className="animate-spin" /> : isCurrent ? <FiCheck size={14} /> : <FiRefreshCw size={14} />}
                                <span>
                                  {isUpdatingThis ? t('Applying...') : isCurrent ? t('Current') : t('Select')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </Masonry>
              ) : (
                <div className="text-center py-12">
                  <FiGrid className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                  <p className="text-slate-600 dark:text-slate-400">{searchTerm ? t('No templates match your search.') : t('No templates available at the moment.')}</p>
                  {searchTerm && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('Try adjusting your search terms.')}</p>}
                </div>
              )}

              {updateMessage && (
                <div className={`mt-6 px-4 py-3 rounded-lg text-sm border ${
                  updateMessage.toLowerCase().includes(t('error').toLowerCase()) || updateMessage.toLowerCase().includes(t('failed').toLowerCase())
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-600'
                    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600'
                }`}>
                  {updateMessage}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!menuInfo && !loading && (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow p-8">
                <FiMenu className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">{t('No Menu Found')}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {selectedBusiness
                        ? t('There is no menu associated with the selected business ({{businessName}}). Please create or assign a menu first.', { businessName: selectedBusiness.name})
                        : t('Please select a business first to manage templates for its menu.')
                    }
                </p>
            </div>
        )}

      </div>
    </div>
  );
};

export default OwnerTemplate;