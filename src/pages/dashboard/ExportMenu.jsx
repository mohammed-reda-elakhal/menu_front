import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload, FiImage, FiCopy, FiDownload, FiAlertCircle,
  FiX, FiPlus, FiCheck, FiInfo, FiMenu, FiTag, FiZap, FiLoader,
  FiHelpCircle, FiCamera, FiEdit, FiChevronDown as FiChevron
} from 'react-icons/fi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { processMenuImage, groupProductsByCategory, formatProductsForExport } from '../../services/menuExtractionService';
import { getMenusByBusiness } from '../../redux/apiCalls/menuApiCalls';
import { getCategoriesByMenu, createCategorie } from '../../redux/apiCalls/categorieApiCalls';
import { getProduitsByMenu, createProduit } from '../../redux/apiCalls/produitApiCalls';

// MUI imports
import {
  Box, Typography, Button, Card, CardContent, CardHeader,
  Paper, IconButton, Chip, Stack, TextField, Tooltip,
  Alert, CircularProgress, Divider, Stepper, Step, StepLabel,
  alpha, ThemeProvider, createTheme, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import QuickProductModal from '../../components/dashboard/modals/QuickProductModal';
import { Link } from 'react-router-dom';

// Styled components
const ProductCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 8px rgba(0, 0, 0, 0.3)'
      : '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : theme.palette.background.paper,
  borderColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.main, 0.1)
    : theme.palette.divider,
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '0.75rem',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.2)'
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  borderLeft: `3px solid ${theme.palette.primary.main}`,
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.25)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
  }
}));

const UploadCard = styled(Box)(({ theme, isDragActive, hasError }) => ({
  border: '1px dashed',
  borderColor: hasError
    ? theme.palette.error.main
    : isDragActive
      ? theme.palette.primary.main
      : theme.palette.divider,
  borderRadius: '0.75rem',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isDragActive
    ? alpha(theme.palette.primary.main, 0.03)
    : hasError
      ? alpha(theme.palette.error.main, 0.03)
      : theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.2)'
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    borderColor: hasError
      ? theme.palette.error.main
      : theme.palette.primary.main,
    backgroundColor: hasError
      ? alpha(theme.palette.error.main, 0.03)
      : alpha(theme.palette.primary.main, 0.03),
  }
}));

const StepContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: '0.75rem',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 8px rgba(0, 0, 0, 0.15)'
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  borderTop: `2px solid ${theme.palette.primary.main}`,
}));

// Progress bar component for the upload section
const FloatingProgressBar = styled(Box)(({ theme, darkMode }) => ({
  position: 'relative',
  width: '100%',
  zIndex: 10,
  padding: '10px 16px',
  borderRadius: '1rem',
  backgroundColor: darkMode
    ? alpha(theme.palette.background.paper, 0.9)
    : alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(8px)',
  boxShadow: darkMode
    ? '0 4px 12px rgba(0, 0, 0, 0.25)'
    : '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
}));

// User Guide styled components
const GuideContainer = styled(Paper)(({ theme, darkMode }) => ({
  borderRadius: '1.25rem',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  backgroundColor: darkMode
    ? alpha(theme.palette.background.paper, 0.8)
    : theme.palette.background.paper,
  boxShadow: darkMode
    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)',
  borderTop: `3px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease',
}));

const GuideHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-1px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '3px',
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: '3px 3px 0 0'
  }
}));

const GuideContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
}));

const GuideStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  }
}));

const StepIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const TipContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: alpha(theme.palette.info.main, 0.05),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  marginTop: theme.spacing(2),
}));

const ExportMenu = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux state
  const { selectedBusiness } = useSelector(state => state.business);
  const { menusByBusiness, loading: menuLoading } = useSelector(state => state.menu);
  const { categoriesByMenu, loading: categoriesLoading } = useSelector(state => state.categorie);
  const { produitsByMenu, loading: productsLoading } = useSelector(state => state.produit);

  // Local state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [hasMenu, setHasMenu] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false); // User guide visibility state - closed by default

  // State for category forms (one per extracted category)
  const [categoryForms, setCategoryForms] = useState({});
  // Track which forms are open (visible)
  const [openCategoryForms, setOpenCategoryForms] = useState({});

  // State for product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalLoading, setProductModalLoading] = useState(false);
  const [productModalError, setProductModalError] = useState(null);
  const [productModalSuccess, setProductModalSuccess] = useState(false);

  // Steps for the extraction process
  const steps = [
    { label: t('exportMenu.steps.upload'), icon: <FiImage /> },
    { label: t('exportMenu.steps.process'), icon: <FiUpload /> },
    { label: t('exportMenu.steps.review'), icon: <FiMenu /> }
  ];

  // Fetch menus for the selected business
  useEffect(() => {
    if (selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  // Set initial menu and hasMenu state
  useEffect(() => {
    if (menusByBusiness && menusByBusiness.length > 0) {
      setHasMenu(true);
      // Select the first menu by default
      const firstMenu = menusByBusiness[0];
      setSelectedMenuId(firstMenu._id);
      // setSelectedMenu(firstMenu); // Commented out as we removed the state variable
    } else {
      setHasMenu(false);
      setSelectedMenuId(null);
      // setSelectedMenu(null); // Commented out as we removed the state variable
    }
  }, [menusByBusiness]);

  // Fetch categories for the selected menu
  useEffect(() => {
    if (selectedMenuId) {
      dispatch(getCategoriesByMenu(selectedMenuId));
      // Optionally fetch products for reference
      dispatch(getProduitsByMenu(selectedMenuId));
    }
  }, [dispatch, selectedMenuId]);

  // Group products by category (for extracted products from image)
  const groupedProducts = useMemo(() => {
    return groupProductsByCategory(extractedProducts);
  }, [extractedProducts]);

  // Handle menu selection - currently not used but kept for future functionality
  // const handleMenuSelect = (menuId) => {
  //   setSelectedMenuId(menuId);
  //   const menu = menusByBusiness.find(m => m._id === menuId);
  //   if (menu) setSelectedMenu(menu);
  // };

  // Create a custom theme based on the app's dark/light mode
  const customTheme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3768e5',
        light: '#6e8fec',
        dark: '#1e4ccc',
      },
      secondary: {
        main: '#757de8',
      },
      background: {
        default: darkMode ? '#01021b' : '#f8f9fa',
        paper: darkMode ? '#0a0c2c' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e7e7e7' : '#2d3748',
        secondary: darkMode ? '#a0aec0' : '#4a5568',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#047857',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#B91C1C',
      },
      info: {
        main: '#3B82F6',
        light: '#93C5FD',
        dark: '#1D4ED8',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#B45309',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '0.75rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '1.25rem',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '1.25rem',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
      },
    },
  }), [darkMode]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;
    processFile(file);
  };

  // Process the selected file
  const processFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(t('exportMenu.errors.invalidFileType'));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('exportMenu.errors.fileTooLarge'));
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Reset previous results
    setExtractedProducts([]);
    setProcessingProgress(0);
    setSuccessMessage(null);

    // Move to the next step
    setActiveStep(1);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Process image with Gemini API
  const processImage = async () => {
    if (!imageFile) {
      setError(t('exportMenu.errors.noImage'));
      return;
    }

    try {
      // Reset any previous errors or success messages
      setError(null);
      setSuccessMessage(null);

      // Start processing and show progress bar
      setIsProcessing(true);
      setProcessingProgress(0);

      // Scroll to make sure progress bar is visible
      window.scrollTo({
        top: window.scrollY,
        behavior: 'smooth'
      });

      // Use the service to process the image
      const products = await processMenuImage(imageFile, (progress) => {
        setProcessingProgress(progress);
      });

      // Update state with the extracted products
      setExtractedProducts(products);

      // Set progress to 100% to indicate completion
      setProcessingProgress(100);

      if (products.length > 0) {
        setSuccessMessage(t('exportMenu.success.extracted', { count: products.length }));
        // Move to the review step
        setActiveStep(2);
      } else {
        setError(t('exportMenu.errors.noProductsFound'));
      }

      // Keep the progress bar visible for a moment after completion
      setTimeout(() => {
        setIsProcessing(false);
        // Reset progress after the progress bar has faded out
        setTimeout(() => setProcessingProgress(0), 500);
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      setError(t('exportMenu.errors.processingFailed', { error: err.message }));

      // Keep the progress bar visible for a moment even on error
      setTimeout(() => {
        setIsProcessing(false);
        setTimeout(() => setProcessingProgress(0), 500);
      }, 1000);
    }
  };

  // Reset the extraction process
  const resetProcess = () => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedProducts([]);
    setProcessingProgress(0);
    setError(null);
    setSuccessMessage(null);
    setActiveStep(0);
  };

  // Download extracted products as JSON
  const downloadProductsAsJson = () => {
    if (groupedProducts.length === 0) {
      setError(t('exportMenu.errors.noProductsToDownload') || 'No products to download');
      return;
    }

    const formattedData = formatProductsForExport(groupedProducts);
    const dataStr = JSON.stringify(formattedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileName = t('exportMenu.fileName') || 'menu-products.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (groupedProducts.length === 0) {
      setError(t('exportMenu.errors.noProductsToCopy') || 'No products to copy');
      return;
    }

    const formattedData = formatProductsForExport(groupedProducts);

    navigator.clipboard.writeText(JSON.stringify(formattedData, null, 2))
      .then(() => {
        alert(t('exportMenu.success.copied') || 'Products copied to clipboard!');
      })
      .catch(err => {
        setError(t('exportMenu.errors.failedToCopy', { error: err.message }) || 'Failed to copy: ' + err.message);
      });
  };

  // Reset category and product forms when new products are extracted
  useEffect(() => {
    if (groupedProducts.length > 0) {
      const initialCategoryForms = {};
      const initialCategoryOpen = {};

      groupedProducts.forEach((cat, catIdx) => {
        // Initialize category forms
        initialCategoryForms[catIdx] = {
          name: cat.categorie_name || '',
          description: '',
          image: null,
          imagePreview: null,
          loading: false,
          error: null,
          success: false,
        };
        // Hide forms by default
        initialCategoryOpen[catIdx] = false;
      });

      setCategoryForms(initialCategoryForms);
      setOpenCategoryForms(initialCategoryOpen);
    }
  }, [groupedProducts]);

  // Create file input refs for category images
  const categoryImageRefs = useRef([]);

  // Initialize refs when grouped products change
  useEffect(() => {
    categoryImageRefs.current = Array(groupedProducts.length)
      .fill()
      .map((_, i) => categoryImageRefs.current[i] || React.createRef());
  }, [groupedProducts.length]);

  // Handle input changes for category forms
  const handleCategoryInputChange = (idx, field, value) => {
    setCategoryForms(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: value,
        error: null,
        success: false,
      }
    }));
  };

  // Toggle category form visibility
  const toggleCategoryForm = (idx, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setOpenCategoryForms(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };



  // Handle image upload for category
  const handleCategoryImageChange = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setCategoryForms(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          error: t('categoryForm.imageTypeError'),
          success: false,
        }
      }));
      return;
    }

    // Validate file size (1MB max - to match backend limit)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      setCategoryForms(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          error: t('categoryForm.imageSizeError') || 'File is too large. Maximum size is 1MB',
          success: false,
        }
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryForms(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          image: file,
          imagePreview: reader.result,
          error: null,
          success: false,
        }
      }));
    };
    reader.readAsDataURL(file);
  };



  // Handle submit for category creation
  const handleCategorySubmit = async (idx) => {
    const form = categoryForms[idx];
    if (!form.name) {
      handleCategoryInputChange(idx, 'error', t('categoryForm.nameRequired'));
      return;
    }
    handleCategoryInputChange(idx, 'loading', true);

    // Prepare form data as in CategoryForm.jsx
    const formData = new FormData();
    formData.append('nom', form.name);
    formData.append('description', form.description || '');
    formData.append('menu', selectedMenuId);

    // Handle image upload - ensure it's a valid File object
    if (form.image && form.image instanceof File) {
      console.log('Attaching image to form data:', form.image.name, form.image.type, form.image.size);
      formData.append('image', form.image);
    } else {
      console.log('No valid image file found in form data');
    }

    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'File object' : pair[1]));
    }

    try {
      // Create a promise to handle the dispatch result
      const actionResult = createCategorie(formData);
      const result = await dispatch(actionResult);
      console.log('Category creation result:', result);

      if (result && result.success) {
        // Set success state in the form
        setCategoryForms(prev => ({
          ...prev,
          [idx]: {
            ...prev[idx],
            loading: false,
            error: null,
            success: true,
          }
        }));
        // Refresh categories for the selected menu
        dispatch(getCategoriesByMenu(selectedMenuId));

        // Show the success message for a moment before hiding the form
        setTimeout(() => {
          setOpenCategoryForms(prev => ({
            ...prev,
            [idx]: false
          }));
        }, 1500); // Show success message for 1.5 seconds before hiding
      } else {
        // Handle API success but business logic failure
        setCategoryForms(prev => ({
          ...prev,
          [idx]: {
            ...prev[idx],
            loading: false,
            error: (result && result.error) || t('categoryForm.error', 'Error creating category'),
            success: false,
          }
        }));
      }
    } catch (err) {
      console.error('Error in category creation:', err);
      setCategoryForms(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          loading: false,
          error: err?.response?.data?.message || err?.message || t('categoryForm.error', 'Error creating category'),
          success: false,
        }
      }));
    }
  };

  // Handle product modal open
  const handleOpenProductModal = (product, categoryId) => {
    console.log('Opening product modal with:', { product, categoryId });

    // Ensure we have a valid category ID
    if (!categoryId || categoryId.trim() === '') {
      // If no category ID is provided, try to find a default one
      const defaultCategory = categoriesByMenu && categoriesByMenu.length > 0 ? categoriesByMenu[0]._id : '';

      if (!defaultCategory) {
        alert(t('productForm.noCategoriesAvailable') || 'Please create a category first');
        return;
      }

      categoryId = defaultCategory;
    }

    setSelectedProduct({
      ...product,
      categoryId: categoryId
    });
    setProductModalOpen(true);
    setProductModalError(null);
    setProductModalSuccess(false);
  };

  // Handle product modal close
  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setProductModalError(null);
      setProductModalSuccess(false);
    }, 300);
  };

  // Handle product creation from modal
  const handleProductSubmit = async (formData) => {
    // Validate form data
    if (!formData.name || !formData.price || !formData.categoryId || !formData.image) {
      setProductModalError(t('productForm.validationError'));
      return;
    }

    // Validate category ID is not empty
    if (!formData.categoryId || formData.categoryId.trim() === '') {
      setProductModalError(t('productForm.categoryRequired'));
      return;
    }

    setProductModalLoading(true);
    setProductModalError(null);

    try {
      // Log the form data for debugging
      console.log('Product form data:', formData);

      // Create product data object
      const productData = {
        nom: formData.name,
        description: formData.description || '',
        // Ensure price is a number and properly formatted
        prix: parseFloat(formData.price).toFixed(2),
        categorie: formData.categoryId,
        image: formData.image,
        visible: true,
        isVegetarian: false,
        isSpicy: false,
        isHalal: false,
        // Add currency information
        currency: 'DH'
      };

      console.log('Sending product data:', productData);

      // Dispatch the action to create product
      const actionResult = createProduit(productData);
      const result = await dispatch(actionResult);
      console.log('Product creation result:', result);

      if (result && result.success) {
        setProductModalSuccess(true);
        setProductModalError(null);

        console.log('Product created successfully with price:', formData.price, 'DH');

        // Refresh products for the selected menu
        dispatch(getProduitsByMenu(selectedMenuId));

        // Show success message for a moment before closing the modal
        setTimeout(() => {
          handleCloseProductModal();
        }, 1500); // Show success message for 1.5 seconds before closing
      } else {
        setProductModalError((result && result.error) || t('productForm.error'));
      }
    } catch (err) {
      console.error('Error in product creation:', err);
      setProductModalError(err?.response?.data?.message || err?.message || t('productForm.error'));
    } finally {
      setProductModalLoading(false);
    }
  };

  // Loading state
  const isLoading = menuLoading || categoriesLoading || productsLoading;

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            fontWeight="bold"
            align="center"
            sx={{ mb: 4 }}
          >
            {t('exportMenu.title')}
          </Typography>
        </motion.div>

        {/* Vérification de l'existence d'un menu */}
        {!hasMenu ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '1rem',
              backgroundColor: theme => alpha(theme.palette.background.paper, darkMode ? 0.6 : 0.9),
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: theme => alpha(theme.palette.divider, 0.1)
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <FiMenu 
                size={40} 
                style={{ 
                  opacity: 0.5,
                  color: customTheme.palette.primary.main 
                }} 
              />
              <Typography variant="h6" fontWeight="600">
                No Menu
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ maxWidth: 400, mb: 2 }}
              >
                No Menu
              </Typography>
              <Link
                to="/dashboard/menu-settings"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: customTheme.palette.primary.main,
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: customTheme.palette.primary.dark,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <FiPlus size={18} />
                Create Menu
              </Link>
            </Box>
          </Paper>
        ) : (
          // Contenu existant du composant
          <>
            {/* User Guide Section */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GuideContainer darkMode={darkMode}>
                  <GuideHeader onClick={() => setGuideOpen(!guideOpen)}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiHelpCircle
                        size={20}
                        style={{
                          marginRight: 10,
                          color: customTheme.palette.primary.main
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="600">
                        {t('exportMenu.userGuide.title') || 'AI Menu Extraction Guide'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {!guideOpen && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mr: 1, fontSize: '0.7rem' }}
                        >
                          {t('exportMenu.userGuide.clickToExpand') || 'Click to expand'}
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          transform: guideOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <FiChevron size={18} />
                      </IconButton>
                    </Box>
                  </GuideHeader>

                  <AnimatePresence>
                    {guideOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GuideContent>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('exportMenu.userGuide.intro') ||
                              'This tool helps you quickly build your menu by extracting products from menu images using AI. Follow these steps to get the best results:'}
                          </Typography>

                          {/* Step 1 */}
                          <GuideStep>
                            <StepIcon>
                              <FiCamera size={18} />
                            </StepIcon>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                {t('exportMenu.userGuide.step1.title') || '1. Prepare a clear image of your menu'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.step1.description') ||
                                  'Take a clear, well-lit photo of your menu or use a digital menu file. Make sure text is readable and prices are visible.'}
                              </Typography>
                            </Box>
                          </GuideStep>

                          {/* Step 2 */}
                          <GuideStep>
                            <StepIcon>
                              <FiUpload size={18} />
                            </StepIcon>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                {t('exportMenu.userGuide.step2.title') || '2. Upload your menu image'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.step2.description') ||
                                  'Drag and drop your image into the upload area or click to browse files. Supported formats: JPG, PNG, WebP (max 10MB).'}
                              </Typography>
                            </Box>
                          </GuideStep>

                          {/* Step 3 */}
                          <GuideStep>
                            <StepIcon>
                              <FiZap size={18} />
                            </StepIcon>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                {t('exportMenu.userGuide.step3.title') || '3. Process with AI'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.step3.description') ||
                                  'Click "Extract with AI" to process your image. Our AI will identify products, prices, and categorize items automatically.'}
                              </Typography>
                            </Box>
                          </GuideStep>

                          {/* Step 4 */}
                          <GuideStep>
                            <StepIcon>
                              <FiEdit size={18} />
                            </StepIcon>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                {t('exportMenu.userGuide.step4.title') || '4. Review and organize'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.step4.description') ||
                                  'Review extracted products grouped by category. Create categories by clicking the "+" button next to each group.'}
                              </Typography>
                            </Box>
                          </GuideStep>

                          {/* Step 5 */}
                          <GuideStep>
                            <StepIcon>
                              <FiPlus size={18} />
                            </StepIcon>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                {t('exportMenu.userGuide.step5.title') || '5. Add products to your menu'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.step5.description') ||
                                  'Click the "+" button next to each product to add it to your menu. You can edit details before saving.'}
                              </Typography>
                            </Box>
                          </GuideStep>

                          {/* Tips Section */}
                          <TipContainer>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FiInfo
                                size={18}
                                style={{
                                  marginRight: 8,
                                  color: customTheme.palette.info.main
                                }}
                              />
                              <Typography variant="subtitle2" fontWeight="600" color="info.main">
                                {t('exportMenu.userGuide.tips.title') || 'Tips for best results'}
                              </Typography>
                            </Box>
                            <Box component="ul" sx={{ m: 0, pl: 3 }}>
                              <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {t('exportMenu.userGuide.tips.tip1') ||
                                  'Use high-resolution, well-lit images with clear text for better extraction accuracy.'}
                              </Typography>
                              <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {t('exportMenu.userGuide.tips.tip2') ||
                                  'Create categories first before adding products to organize your menu efficiently.'}
                              </Typography>
                              <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {t('exportMenu.userGuide.tips.tip3') ||
                                  'Review extracted prices carefully as they may need adjustment.'}
                              </Typography>
                              <Typography component="li" variant="body2" color="text.secondary">
                                {t('exportMenu.userGuide.tips.tip4') ||
                                  'For menus with multiple pages, process each page separately for best results.'}
                              </Typography>
                            </Box>
                          </TipContainer>
                        </GuideContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GuideContainer>
              </motion.div>
            </AnimatePresence>

            {/* Stepper */}
            <StepContainer sx={{ mb: 4 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    mt: 1,
                    fontSize: '0.8rem'
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    color: 'primary.main',
                    fontWeight: 600
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: 'divider'
                  }
                }}
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      icon={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: index === activeStep
                              ? 'primary.main'
                              : index < activeStep
                                ? 'success.main'
                                : 'text.disabled'
                          }}
                        >
                          {step.icon}
                        </Box>
                      }
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </StepContainer>


            {/* Existing Categories Section - Compact Version */}
            {hasMenu && selectedMenuId && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 3,
                      borderRadius: '1.25rem',
                      maxWidth: 900,
                      mx: 'auto',
                      boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FiTag
                          size={16}
                          style={{
                            marginRight: 8,
                            color: darkMode ? '#818cf8' : '#4f46e5'
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('exportMenu.existingMenuItems') || 'Existing Menu Items'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => setCategoriesModalOpen(true)}
                          startIcon={<FiMenu size={14} />}
                          sx={{
                            borderRadius: '0.75rem',
                            textTransform: 'none',
                            py: 0.5,
                            px: 1.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          {t('exportMenu.viewCategories') || 'View Categories'}
                        </Button>

                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            // Fetch products if not already loaded
                            if (!produitsByMenu && selectedMenuId) {
                              dispatch(getProduitsByMenu(selectedMenuId));
                            }
                          }}
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={14} /> : <FiMenu size={14} />}
                          sx={{
                            borderRadius: '0.75rem',
                            textTransform: 'none',
                            py: 0.5,
                            px: 1.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          {t('exportMenu.refreshData') || 'Refresh'}
                        </Button>
                      </Box>
                    </Box>

                    {/* Categories Summary - Just show count */}
                    {!isLoading && categoriesByMenu && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {categoriesByMenu.length > 0
                            ? t('exportMenu.categoriesCount', { count: categoriesByMenu.length }) || `${categoriesByMenu.length} categories available`
                            : t('exportMenu.noExistingCategories') || 'No categories found'}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Categories Modal */}
            <Dialog
              open={categoriesModalOpen}
              onClose={() => setCategoriesModalOpen(false)}
              maxWidth="md"
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: '1.25rem',
                    boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    p: 1
                  }
                }
              }}
            >
              <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiTag
                    size={18}
                    style={{
                      marginRight: 8,
                      color: darkMode ? '#818cf8' : '#4f46e5'
                    }}
                  />
                  <Typography variant="h6" fontWeight="600">
                    {t('exportMenu.existingCategories') || 'Existing Categories'}
                  </Typography>
                </Box>
                <IconButton onClick={() => setCategoriesModalOpen(false)} size="small">
                  <FiX size={18} />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ pt: 1 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : categoriesByMenu && categoriesByMenu.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {categoriesByMenu.map((category) => (
                      <Chip
                        key={category._id}
                        label={category.nom}
                        color="primary"
                        variant="outlined"
                        size="medium"
                        sx={{
                          height: 32,
                          '& .MuiChip-label': { px: 2, py: 0.5, fontWeight: 500 }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Alert
                    severity="info"
                    icon={<FiInfo size={18} />}
                    sx={{ mt: 1, borderRadius: '0.75rem' }}
                  >
                    {t('exportMenu.noExistingCategories') || 'No categories found. Create categories from extracted menu items.'}
                  </Alert>
                )}
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={() => setCategoriesModalOpen(false)}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: '0.75rem', textTransform: 'none' }}
                >
                  {t('common.close') || 'Close'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Upload Section */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {/* Progress Bar - Positioned above the upload card */}
                {isProcessing && (
                  <Box sx={{
                    width: '100%',
                    mb: 4,
                    mt: 1,
                    maxWidth: 700,
                    mx: 'auto',
                    position: 'relative'
                  }}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4
                      }}
                    >
                      <FloatingProgressBar darkMode={darkMode}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <FiLoader
                            size={18}
                            style={{
                              color: customTheme.palette.primary.main,
                              animation: 'spin 1.5s linear infinite'
                            }}
                          />
                          <Typography variant="body2" fontWeight="500">
                            {t('exportMenu.processing') || `Processing menu extraction... ${processingProgress}%`}
                          </Typography>
                        </Box>
                        <Box sx={{ width: '70%', mx: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={processingProgress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: darkMode
                                ? alpha(customTheme.palette.primary.main, 0.15)
                                : alpha(customTheme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: customTheme.palette.primary.main,
                                transition: 'transform 0.4s ease'
                              }
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="primary"
                          sx={{ minWidth: 40, textAlign: 'right' }}
                        >
                          {`${processingProgress}%`}
                        </Typography>
                      </FloatingProgressBar>
                    </motion.div>
                  </Box>
                )}

                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: '1.25rem',
                    maxWidth: 700,
                    mx: 'auto',
                    boxShadow: darkMode ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" mb={2} align="center">
                    {activeStep === 0
                      ? (t('exportMenu.uploadImage') || 'Upload Menu Image')
                      : activeStep === 1
                        ? (t('exportMenu.processImage') || 'Process Image')
                        : (t('exportMenu.reviewResults') || 'Review Results')}
                  </Typography>

                  <UploadCard
                    isDragActive={isDragActive}
                    hasError={!!error}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {imagePreview ? (
                      <Box position="relative">
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Menu preview"
                          sx={{
                            height: 200,
                            maxWidth: '100%',
                            borderRadius: '0.5rem',
                            mx: 'auto',
                            display: 'block',
                            objectFit: 'contain',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            opacity: isProcessing ? 0.7 : 1
                          }}
                        />

                        {/* Processing overlay - simplified since we have a floating progress bar */}
                        {isProcessing && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              borderRadius: '0.5rem',
                              zIndex: 2
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor: alpha(customTheme.palette.background.paper, 0.85),
                                borderRadius: '0.75rem',
                                px: 2,
                                py: 1,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                backdropFilter: 'blur(4px)',
                              }}
                            >
                              <Typography variant="body2" fontWeight="500" color="text.primary">
                                {t('exportMenu.processingImage') || 'Processing image...'}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'error.dark',
                            },
                            width: 32,
                            height: 32,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            zIndex: 3
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            resetProcess();
                          }}
                          disabled={isProcessing}
                        >
                          <FiX size={16} />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                        <FiImage
                          style={{
                            width: 40,
                            height: 40,
                            marginBottom: 16,
                            color: isDragActive
                              ? customTheme.palette.primary.main
                              : (darkMode ? '#a0aec0' : '#4a5568')
                          }}
                        />
                        <Typography variant="body1" gutterBottom fontWeight="500">
                          {isDragActive
                            ? (t('exportMenu.dropHere') || 'Drop image here')
                            : (t('exportMenu.dragDrop') || 'Drag & drop your menu image here')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
                          {t('exportMenu.uploadDescription') || 'Upload a clear image of your menu to extract items automatically using AI'}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<FiUpload />}
                          sx={{
                            borderRadius: '0.5rem',
                            textTransform: 'none',
                            px: 2,
                            py: 0.5
                          }}
                        >
                          {t('exportMenu.browseFiles') || 'Browse files'}
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          {t('exportMenu.imageRequirements')}
                        </Typography>
                      </Box>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  </UploadCard>

                  {error && (
                    <Alert
                      severity="error"
                      icon={<FiAlertCircle size={18} />}
                      sx={{ mt: 3, py: 1, borderRadius: '0.75rem' }}
                    >
                      {error}
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert
                      severity="success"
                      icon={<FiCheck size={18} />}
                      sx={{ mt: 3, py: 1, borderRadius: '0.75rem' }}
                    >
                      {successMessage}
                    </Alert>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {activeStep > 0 && (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={resetProcess}
                        sx={{
                          px: 3,
                          borderRadius: '0.75rem',
                          textTransform: 'none'
                        }}
                      >
                        {t('exportMenu.reset') || 'Reset'}
                      </Button>
                    )}

                    {activeStep === 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={processImage}
                        disabled={!imageFile || isProcessing}
                        startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : <FiZap size={16} />}
                        sx={{
                          px: 2,
                          py: 0.75,
                          borderRadius: '0.5rem',
                          textTransform: 'none'
                        }}
                      >
                        {isProcessing ? (
                          t('exportMenu.processing') || 'Processing...'
                        ) : (
                          t('exportMenu.processImage') || 'Extract with AI'
                        )}
                      </Button>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            </AnimatePresence>

            {/* Results Section - Grouped by Category (for extracted products) */}
            {groupedProducts.length > 0 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                sx={{ mt: 3 }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: '0.75rem',
                    borderLeft: '3px solid',
                    borderLeftColor: 'primary.main'
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <FiMenu
                        size={18}
                        style={{
                          marginRight: 8,
                          color: customTheme.palette.primary.main
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        component="h2"
                        fontWeight="600"
                        color="primary"
                      >
                        {t('exportMenu.extractedProducts')} ({groupedProducts.reduce((total, cat) => total + cat.products.length, 0)})
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={copyToClipboard}
                        startIcon={<FiCopy size={14} />}
                        sx={{
                          borderRadius: '0.5rem',
                          textTransform: 'none',
                          py: 0.5
                        }}
                      >
                        {t('exportMenu.copy')}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={downloadProductsAsJson}
                        startIcon={<FiDownload size={14} />}
                        sx={{
                          borderRadius: '0.5rem',
                          textTransform: 'none',
                          py: 0.5
                        }}
                      >
                        {t('exportMenu.download')}
                      </Button>
                    </Stack>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('exportMenu.extractionSuccess') || 'The following items were successfully extracted from your menu image. You can now create categories and products.'}
                  </Typography>

                  {/* Categories and Products */}
                  <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    {groupedProducts.map((category, categoryIndex) => (
                    <CategoryCard key={categoryIndex} variant="outlined" sx={{ mb: 3 }}>
                      {/* --- Category Quick Create Form --- */}
                      {openCategoryForms[categoryIndex] && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            mb: 1,
                            backgroundColor: alpha(customTheme.palette.primary.main, 0.03)
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FiImage size={16} style={{ marginRight: 6, color: customTheme.palette.primary.main }} />
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              sx={{
                                color: customTheme.palette.text.primary,
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}
                            >
                              {t('exportMenu.quickCreateCategory')}
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 1 }} />

                          <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2
                            }}
                            onSubmit={e => {
                              e.preventDefault();
                              handleCategorySubmit(categoryIndex);
                            }}
                          >
                            {/* Form Fields Container */}
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                              {/* Left Column - Text Fields */}
                              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label={t('categoryForm.name')}
                                  placeholder={t('categoryForm.namePlaceholder')}
                                  value={categoryForms[categoryIndex]?.name || ''}
                                  onChange={e => handleCategoryInputChange(categoryIndex, 'name', e.target.value)}
                                  required
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      '&:hover fieldset': {
                                        borderColor: customTheme.palette.primary.main,
                                      },
                                    },
                                    '& .MuiInputBase-input': {
                                      fontSize: '0.875rem',
                                      paddingLeft: '24px',
                                      position: 'relative',
                                      '&::before': {
                                        content: '"•"',
                                        position: 'absolute',
                                        left: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: (theme) => theme.palette.text.secondary,
                                        fontSize: '1.2rem'
                                      }
                                    }
                                  }}
                                />

                                <TextField
                                  fullWidth
                                  size="small"
                                  label={t('categoryForm.description')}
                                  placeholder={t('categoryForm.descriptionPlaceholder')}
                                  value={categoryForms[categoryIndex]?.description || ''}
                                  onChange={e => handleCategoryInputChange(categoryIndex, 'description', e.target.value)}
                                  multiline
                                  rows={1}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      '&:hover fieldset': {
                                        borderColor: customTheme.palette.primary.main,
                                      },
                                    },
                                    '& .MuiInputBase-input': {
                                      fontSize: '0.875rem',
                                      paddingLeft: '24px',
                                      position: 'relative',
                                    },
                                    '& .MuiInputBase-root': {
                                      '&::before': {
                                        content: '"•"',
                                        position: 'absolute',
                                        left: '8px',
                                        top: '12px',
                                        color: (theme) => theme.palette.text.secondary,
                                        fontSize: '1.2rem',
                                        zIndex: 1
                                      }
                                    }
                                  }}
                                />
                              </Box>

                              {/* Right Column - Image Upload */}
                              <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: { xs: '100%', sm: 140 },
                                p: { xs: 1, sm: 1.5 },
                                borderRadius: 1,
                                border: '1px dashed',
                                borderColor: 'divider',
                                bgcolor: alpha(customTheme.palette.background.paper, 0.5)
                              }}>
                                <input
                                  type="file"
                                  id={`category-image-${categoryIndex}`}
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleCategoryImageChange(categoryIndex, e)}
                                  style={{ display: 'none' }}
                                />

                                {categoryForms[categoryIndex]?.imagePreview ? (
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Box
                                      component="img"
                                      src={categoryForms[categoryIndex].imagePreview}
                                      alt="Category preview"
                                      sx={{
                                        width: { xs: 80, sm: 100 },
                                        height: { xs: 80, sm: 100 },
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                        mb: 1,
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }}
                                    />
                                    <label htmlFor={`category-image-${categoryIndex}`}>
                                      <Button
                                        component="span"
                                        variant="outlined"
                                        size="small"
                                        startIcon={<FiImage size={14} />}
                                        sx={{ mt: 1, fontSize: '0.75rem' }}
                                      >
                                        {t('categoryForm.changeImage')}
                                      </Button>
                                    </label>
                                  </Box>
                                ) : (
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Tooltip title={t('categoryForm.maxSize')}>
                                      <IconButton
                                        component="label"
                                        htmlFor={`category-image-${categoryIndex}`}
                                        sx={{
                                          width: { xs: 60, sm: 70 },
                                          height: { xs: 60, sm: 70 },
                                          mb: 1,
                                          border: '2px dashed',
                                          borderColor: alpha(customTheme.palette.primary.main, 0.3),
                                          '&:hover': {
                                            borderColor: customTheme.palette.primary.main,
                                            bgcolor: alpha(customTheme.palette.primary.main, 0.05)
                                          }
                                        }}
                                      >
                                        <FiImage size={24} style={{ color: customTheme.palette.primary.main }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      {t('categoryForm.addImage')}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                      (JPG, PNG, WebP - 1MB)
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            {/* Form Status and Submit Button */}
                            <Box sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              justifyContent: 'flex-end',
                              alignItems: { xs: 'stretch', sm: 'center' },
                              mt: 0.5,
                              gap: 1
                            }}>
                              <Box sx={{ flex: 1, minHeight: 32 }}>
                                {categoryForms[categoryIndex]?.error && (
                                  <Alert severity="error" sx={{ py: 0, fontSize: '0.7rem', minHeight: 32 }}>
                                    {categoryForms[categoryIndex].error}
                                  </Alert>
                                )}
                                {categoryForms[categoryIndex]?.success && (
                                  <Alert severity="success" sx={{ py: 0, fontSize: '0.7rem', minHeight: 32 }}>
                                    {t('categoryForm.success')}
                                  </Alert>
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  color="inherit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleCategoryForm(categoryIndex);
                                  }}
                                  disabled={categoryForms[categoryIndex]?.loading}
                                  sx={{
                                    minWidth: { xs: 70, sm: 80 },
                                    py: 0.5,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  }}
                                >
                                  {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  type="submit"
                                  disabled={categoryForms[categoryIndex]?.loading}
                                  sx={{
                                    minWidth: { xs: 90, sm: 110 },
                                    py: 0.5,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    boxShadow: 2,
                                    '&:hover': {
                                      boxShadow: 4
                                    }
                                  }}
                                >
                                  {categoryForms[categoryIndex]?.loading
                                    ? <CircularProgress size={20} color="inherit" />
                                    : t('categoryForm.submit')
                                  }
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {/* --- End Category Quick Create Form --- */}



                      <CardHeader
                        title={
                          <Box display="flex" alignItems="center">
                            <MdOutlineRestaurantMenu
                              size={18}
                              style={{
                                marginRight: 8,
                                color: customTheme.palette.primary.main
                              }}
                            />
                            <Typography
                              variant="subtitle1"
                              component="span"
                              fontWeight="600"
                              color="primary"
                            >
                              {category.categorie_name}
                            </Typography>
                          </Box>
                        }
                        action={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${category.products.length} ${category.products.length === 1 ? t('common.item') : t('common.items')}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 'medium',
                                borderRadius: '0.5rem'
                              }}
                            />
                            <Tooltip title={openCategoryForms[categoryIndex]
                              ? t('categoryForm.hideForm') || 'Hide form'
                              : t('categoryForm.createCategory') || 'Create category'
                            }>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => toggleCategoryForm(categoryIndex, e)}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  bgcolor: openCategoryForms[categoryIndex] ? 'primary.main' : 'transparent',
                                  color: openCategoryForms[categoryIndex] ? 'white' : 'primary.main',
                                  border: '1px solid',
                                  borderColor: 'primary.main',
                                  '&:hover': {
                                    bgcolor: openCategoryForms[categoryIndex] ? 'primary.dark' : alpha(customTheme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                {openCategoryForms[categoryIndex] ? <FiX size={16} /> : <FiPlus size={16} />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                        sx={{
                          pb: 0,
                          pt: 1.5,
                          px: 2,
                          '& .MuiCardHeader-action': {
                            margin: 0,
                            alignSelf: 'center'
                          }
                        }}
                      />
                      <CardContent>
                        <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap={true}>
                          {category.products.map((product, productIndex) => (
                            <Box key={productIndex} sx={{ width: { xs: '100%', sm: '48%', md: '32%' }, mb: 1 }}>
                              <ProductCard variant="outlined">
                                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                  <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      noWrap
                                      sx={{
                                        maxWidth: '60%',
                                        color: 'text.primary'
                                      }}
                                    >
                                      {product.product_name}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                      <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                        sx={{
                                          mr: 1,
                                          color: 'primary.main'
                                        }}
                                      >
                                        {`${product.price?.toFixed(2) || '0.00'} DH`}
                                      </Typography>
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          p: 0,
                                          ml: 0.5
                                        }}
                                        onClick={() => {
                                          // Find the category ID - either from the category object or from categoriesByMenu
                                          let categoryId = '';

                                          // First try to get it from the category object
                                          if (category && category._id) {
                                            categoryId = category._id;
                                          }
                                          // If not available, try to find a matching category by name
                                          else if (categoriesByMenu && categoriesByMenu.length > 0 && category.categorie_name) {
                                            const matchingCategory = categoriesByMenu.find(cat =>
                                              cat.nom.toLowerCase() === category.categorie_name.toLowerCase());
                                            if (matchingCategory) {
                                              categoryId = matchingCategory._id;
                                            }
                                          }

                                          handleOpenProductModal({
                                            name: product.product_name,
                                            description: product.description || '',
                                            price: product.price || ''
                                          }, categoryId);
                                        }}
                                      >
                                        <FiPlus size={16} />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                  {product.description && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 1,
                                        fontSize: '0.7rem',
                                        lineHeight: 1.2,
                                        mt: 0.5
                                      }}
                                    >
                                      {product.description}
                                    </Typography>
                                  )}
                                </CardContent>
                              </ProductCard>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </CategoryCard>
                  ))}
                  </Box>
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Product Creation Modal */}
      <QuickProductModal
        open={productModalOpen}
        onClose={handleCloseProductModal}
        onSubmit={handleProductSubmit}
        productData={selectedProduct}
        categories={categoriesByMenu || []}
        loading={productModalLoading}
        error={productModalError}
        success={productModalSuccess}
      />
    </ThemeProvider>
  );
};

export default ExportMenu;
