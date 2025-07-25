import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublishedTemplates } from '../redux/apiCalls/templateApiCalls';
import { getMenusByBusiness, updateMenuTemplate } from '../redux/apiCalls/menuApiCalls';
import {
  Box,
  Typography,
  Container,
  // Chip, // No longer used for cards
  // Card, // No longer used for cards
  // CardContent, // No longer used for cards
  // CardMedia, // No longer used for cards
  Button as MuiButton, // Renamed to avoid conflict if used elsewhere, Button for cards is custom
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  useTheme as useMuiTheme,
  // alpha, // No longer used for cards
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiEye,
  FiStar,
  FiTag,
  FiArrowRight,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiExternalLink,
  FiLayout,
  FiLoader, // Added for loading state in button
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import Masonry from 'react-masonry-css';
import { Template } from '../types/template';

// const MotionCard = motion(Card); // Replaced with motion.div

const FIXED_CARD_HEIGHT = '420px'; // Adjusted slightly for new padding/layout
const CARD_IMAGE_HEIGHT = '180px'; // Adjusted slightly

const Marketplace: React.FC = () => {
  const dispatch = useDispatch();
  const muiTheme = useMuiTheme();
  const { darkMode } = useTheme();

  const { templates, error, loading: templatesLoading } = useSelector((state: any) => state.template);
  const { selectedBusiness } = useSelector((state: any) => state.business);
  const { menusByBusiness, loading: menuLoading } = useSelector((state: any) => state.menu);
  const { user } = useSelector((state: any) => state.auth);

  const [menuInfo, setMenuInfo] = useState<any>(null);
  const [updatingTemplateId, setUpdatingTemplateId] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isRefreshingClientMenu, setIsRefreshingClientMenu] = useState(false);
  const [isGlobalRefreshing, setIsGlobalRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getPublishedTemplates() as any);
  }, [dispatch]);

  useEffect(() => {
    if (user && user.role === 'client' && selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id) as any);
    }
  }, [dispatch, selectedBusiness, user]);

  useEffect(() => {
    if (menusByBusiness && menusByBusiness.length > 0) {
      setMenuInfo(menusByBusiness[0]);
    } else {
      setMenuInfo(null);
    }
  }, [menusByBusiness]);

  const handleTemplateUpdate = async (templateId: string) => {
    if (!templateId || !menuInfo || !menuInfo._id) return;
    setUpdatingTemplateId(templateId);
    setUpdateMessage('');
    try {
      const result = await dispatch(updateMenuTemplate(menuInfo._id, templateId) as any);
      if (result.success) {
        setUpdateMessage('Template updated successfully! Refreshing menu...');
        setShowAlert(true);
        if (selectedBusiness && selectedBusiness._id) {
          await dispatch(getMenusByBusiness(selectedBusiness._id) as any);
        }
      } else {
        setUpdateMessage(`Error: ${result.error || 'Failed to update template.'}`);
        setShowAlert(true);
      }
    } catch (err: any) {
      setUpdateMessage(`Failed to update template: ${err.message || 'Unknown error'}`);
      setShowAlert(true);
    } finally {
      setUpdatingTemplateId(null);
    }
  };
  
  useEffect(() => {
    if (showAlert && updateMessage && !updateMessage.toLowerCase().includes('error') && !updateMessage.toLowerCase().includes('failed')) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setUpdateMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, updateMessage]);

  const handleGlobalRefresh = async () => {
    setIsGlobalRefreshing(true);
    try {
      await dispatch(getPublishedTemplates() as any);
      if (user && user.role === 'client' && selectedBusiness && selectedBusiness._id) {
        await dispatch(getMenusByBusiness(selectedBusiness._id) as any);
      }
    } finally {
      setIsGlobalRefreshing(false);
    }
  };
  
  const handleRefreshClientMenu = async () => {
    if (user && user.role === 'client' && selectedBusiness && selectedBusiness._id) {
      setIsRefreshingClientMenu(true);
      try {
        await dispatch(getMenusByBusiness(selectedBusiness._id) as any);
      } finally {
        setIsRefreshingClientMenu(false);
      }
    }
  };

  const isClient = user && user.role === 'client';
  const hasSelectedBusiness = !!(selectedBusiness && selectedBusiness._id);
  const canSelectTemplates = isClient && hasSelectedBusiness && menuInfo;

  const sortedDisplayTemplates = useMemo(() => {
    if (!templates || templates.length === 0) return [];
    let displayTemplatesList = [...templates];
    if (canSelectTemplates && menuInfo.template && menuInfo.template._id) {
      const currentTemplateId = menuInfo.template._id;
      const currentIndex = displayTemplatesList.findIndex(t => t._id === currentTemplateId);
      if (currentIndex > -1) {
        const currentTemplateItem = displayTemplatesList.splice(currentIndex, 1)[0];
        displayTemplatesList.unshift(currentTemplateItem);
      }
    }
    return displayTemplatesList;
  }, [templates, menuInfo, canSelectTemplates]);

  const breakpointColumnsObj = { default: 3, 1200: 3, 900: 2, 600: 1 };

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-dark-bg' : 'bg-light-bg'} pt-20`}>
        <div className={`text-center p-6 rounded-lg shadow-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <FiAlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <Typography variant="h5" className="text-red-600 dark:text-red-400 mb-2">Oops! Something went wrong.</Typography>
          <Typography variant="body1" className={`mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{error}</Typography>
          <MuiButton variant="contained" startIcon={isGlobalRefreshing ? <CircularProgress size={20} color="inherit" /> : <FiRefreshCw />} onClick={handleGlobalRefresh} disabled={isGlobalRefreshing || templatesLoading}>
            {isGlobalRefreshing ? 'Refreshing...' : 'Try Again'}
          </MuiButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <div className="pt-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute top-0 -left-4 w-72 h-72 rounded-full blur-[60px] transition-colors duration-300 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`} />
          <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[60px] transition-colors duration-300 ${darkMode ? 'bg-primary/15' : 'bg-primary/5'}`} />
        </div>

        <Container maxWidth="lg" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Template Marketplace
              </Typography>
              <Tooltip title="Refresh Templates & Menu Data" arrow>
                <IconButton onClick={handleGlobalRefresh} disabled={isGlobalRefreshing || templatesLoading || menuLoading} size="large" sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: darkMode ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)', '&:hover': { color: 'primary.main' } }}>
                  {isGlobalRefreshing || templatesLoading ? <CircularProgress size={24} color="inherit" /> : <FiRefreshCw />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" className={darkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>Choose from our collection of beautiful menu templates.</Typography>
          </motion.div>

         

          {templatesLoading && !sortedDisplayTemplates.length ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                <CircularProgress size={40} /><Typography variant="h6" className={`ml-2 ${darkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Loading Templates...</Typography>
             </Box>
          ) : !templatesLoading && !sortedDisplayTemplates.length ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <FiLayout size={48} style={{ color: muiTheme.palette.text.disabled, marginBottom: muiTheme.spacing(2) }} />
              <Typography variant="h6" className={darkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>No templates available.</Typography>
              <Typography className={darkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>Please check back later or try refreshing.</Typography>
            </Box>
          ) : (
            <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto -ml-4" columnClassName="pl-4 bg-clip-padding">
              {sortedDisplayTemplates.map((template: Template, index: number) => {
                // Button logic
                let buttonIcon, buttonText, buttonBaseClasses, buttonActionClasses, finalButtonClasses, buttonDisabledState;

                const isCurrentTemplate = menuInfo?.template?._id === template._id;
                const isUpdatingThisTemplate = updatingTemplateId === template._id;

                buttonBaseClasses = "w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

                if (isUpdatingThisTemplate) {
                  buttonIcon = <FiLoader size={16} className="animate-spin" />;
                  buttonText = 'Applying...';
                  // Use a slightly desaturated primary or gray to indicate loading, but still show it's related to primary action
                  buttonActionClasses = 'bg-primary/60 dark:bg-primary/50 text-white cursor-wait';
                  buttonDisabledState = true;
                } else if (isCurrentTemplate) {
                  buttonIcon = <FiCheck size={16} />;
                  buttonText = 'Current Template';
                  buttonActionClasses = 'bg-green-600 dark:bg-green-700 text-white cursor-default';
                  buttonDisabledState = true;
                } else {
                  buttonIcon = <FiRefreshCw size={16} />;
                  buttonText = 'Select Template';
                  // Ensure your tailwind.config.js has 'primary' defined. E.g. primary: colors.indigo
                  buttonActionClasses = 'bg-primary hover:bg-primary/90 text-white focus:ring-primary dark:hover:bg-primary/80';
                  buttonDisabledState = menuLoading; // Or other conditions like !template.isFree
                }
                
                finalButtonClasses = `${buttonBaseClasses} ${buttonActionClasses} ${buttonDisabledState || menuLoading ? 'opacity-70 cursor-not-allowed' : ''}`;
                if (buttonDisabledState) { // More explicit disabled styling for Tailwind
                  finalButtonClasses += ` disabled:opacity-60 disabled:cursor-not-allowed`;
                }


                return (
                  <div key={template._id} className="mb-4"> {/* Masonry item wrapper */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.4 }}
                      className={`group flex flex-col h-[${FIXED_CARD_HEIGHT}] bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 ease-in-out hover:-translate-y-1 overflow-hidden`}
                    >
                      {/* Image Section */}
                      <div className="relative p-2">
                        <div className={`relative overflow-hidden rounded-lg h-[${CARD_IMAGE_HEIGHT}]`}>
                          <img
                            src={template.imagePreview?.url || `https://via.placeholder.com/400x${parseInt(CARD_IMAGE_HEIGHT)}/?text=No+Image`}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {template.demoPath && (
                              <a
                                href={template.demoPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors"
                              >
                                <FiExternalLink size={14} />
                                <span>View Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col flex-grow p-4 pt-2">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate">
                          {template.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                          {template.description || "No description available."}
                        </p>

                        {/* Tags/Chips */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                            <FiTag size={12} />
                            <span>{template.category}</span>
                          </div>
                          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${template.isFree ? (darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700')}`}>
                            <FiStar size={12} />
                            <span>{template.isFree ? 'Free' : `$${template.price}`}</span>
                          </div>
                        </div>
                        
                        {/* Action Button Section */}
                        <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700">
                          {canSelectTemplates && template.isFree && (
                            <button
                              type="button"
                              onClick={() => handleTemplateUpdate(template._id)}
                              disabled={buttonDisabledState || menuLoading || updatingTemplateId === template._id}
                              className={finalButtonClasses}
                            >
                              {buttonIcon}
                              <span>{buttonText}</span>
                            </button>
                          )}
                          {(!canSelectTemplates || !template.isFree) && template.demoPath && (
                             <a
                                href={template.demoPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${buttonBaseClasses} border border-primary/70 dark:border-primary/60 text-primary dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-primary`}
                             >
                                <FiExternalLink size={16} />
                                <span>View Demo</span>
                              </a>
                          )}
                           {/* Fallback for non-free templates if client cannot select, or no demo path */}
                           {(!canSelectTemplates || !template.isFree) && !template.demoPath && (
                             <div className={`${buttonBaseClasses} border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 cursor-default`}>
                                <FiEye size={16} />
                                <span>Details Soon</span> {/* Or similar placeholder */}
                              </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </Masonry>
          )}
        </Container>
      </div>

      <Snackbar open={showAlert} autoHideDuration={updateMessage.toLowerCase().includes('error') || updateMessage.toLowerCase().includes('failed') ? null : 6000} onClose={() => { setShowAlert(false); if (!updateMessage.toLowerCase().includes('error') && !updateMessage.toLowerCase().includes('failed')) setUpdateMessage(''); }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => { setShowAlert(false); if (!updateMessage.toLowerCase().includes('error') && !updateMessage.toLowerCase().includes('failed')) setUpdateMessage(''); }} severity={updateMessage.toLowerCase().includes('error') || updateMessage.toLowerCase().includes('failed') ? 'error' : 'success'} sx={{ width: '100%' }} variant="filled">
          {updateMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Marketplace;