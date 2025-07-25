import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme as useMuiTheme,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { FiEye, FiEyeOff, FiEdit2, FiTrash2, FiFilter, FiX, FiStar } from 'react-icons/fi';
import { getProduitsByMenu } from '../../../redux/apiCalls/produitApiCalls';
import { useTheme } from '../../../context/ThemeContext';

// Add custom styles for responsive table
const tableStyles = {
  responsiveTable: {
    '.MuiTableContainer-root': {
      overflowX: 'auto',
    },
    '@media (max-width: 600px)': {
      '.MuiTable-root': {
        minWidth: '800px',
      },
    },
  },
};

const ProductsList = ({ menuId, onEdit, onDelete, onToggleVisibility, onToggleIsBest, products, onBulkDelete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { produitsByMenu, loading } = useSelector(state => state.produit);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);

  // Use products prop if provided, otherwise fallback to Redux
  const dataSource = products || produitsByMenu;

  useEffect(() => {
    if (menuId) {
      dispatch(getProduitsByMenu(menuId));
    }
  }, [dispatch, menuId]);

  // Get unique categories from products with proper deduplication
  const categories = React.useMemo(() => {
    if (!dataSource) return [];
    const uniqueCategories = new Map();
    dataSource.forEach(product => {
      if (product.categorie && product.categorie._id) {
        const categoryId = product.categorie._id;
        if (!uniqueCategories.has(categoryId)) {
          uniqueCategories.set(categoryId, {
            _id: categoryId,
            nom: product.categorie.nom,
            productCount: 1
          });
        } else {
          const category = uniqueCategories.get(categoryId);
          category.productCount += 1;
        }
      }
    });
    return Array.from(uniqueCategories.values());
  }, [dataSource]);

  // Filter products by selected category
  const filteredProducts = React.useMemo(() => {
    if (!dataSource) return [];
    return selectedCategory === 'all'
      ? dataSource
      : dataSource.filter(product => product.categorie._id === selectedCategory);
  }, [dataSource, selectedCategory]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle select one
  const handleSelectOne = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };
  const confirmBulkDelete = () => {
    if (onBulkDelete && selectedProducts.length > 0) {
      onBulkDelete(selectedProducts);
    }
    setSelectedProducts([]);
    setBulkDeleteDialogOpen(false);
  };
  const cancelBulkDelete = () => {
    setBulkDeleteDialogOpen(false);
  };

  // Handle single delete
  const handleSingleDelete = (id) => {
    setSingleDeleteId(id);
    setSingleDeleteDialogOpen(true);
  };
  const confirmSingleDelete = () => {
    if (onDelete && singleDeleteId) {
      onDelete(singleDeleteId);
    }
    setSingleDeleteDialogOpen(false);
    setSingleDeleteId(null);
  };
  const cancelSingleDelete = () => {
    setSingleDeleteDialogOpen(false);
    setSingleDeleteId(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Bulk Delete Button */}
      {selectedProducts.length > 0 && (
        <div className="mb-2 flex justify-end">
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            size="small"
            style={{ minWidth: 120 }}
          >
            {t('dashboard.products.products.bulkDeleteButton') || `Delete (${selectedProducts.length})`}
          </Button>
        </div>
      )}
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={cancelBulkDelete}>
        <DialogTitle>{t('dashboard.products.products.bulkDeleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          {t('dashboard.products.products.bulkDeleteConfirmMessage')}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelBulkDelete}>{t('dashboard.common.cancel')}</Button>
          <Button onClick={confirmBulkDelete} color="error">{t('dashboard.products.products.bulkDeleteButton')}</Button>
        </DialogActions>
      </Dialog>
      {/* Single Delete Confirmation Dialog */}
      <Dialog open={singleDeleteDialogOpen} onClose={cancelSingleDelete}>
        <DialogTitle>{t('dashboard.products.products.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          {t('dashboard.products.products.deleteConfirmMessage')}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSingleDelete}>{t('dashboard.common.cancel')}</Button>
          <Button onClick={confirmSingleDelete} color="error">{t('dashboard.products.products.delete')}</Button>
        </DialogActions>
      </Dialog>
      {/* Categories Section - Hidden on mobile by default */}
      <div className={`
        fixed inset-x-0 bottom-0 p-4 z-50 transition-transform duration-300 ease-in-out
        transform md:transform-none md:static md:bg-transparent md:p-0
        ${darkMode ? 'bg-[#01021b]' : 'bg-white border-t border-gray-200'}
        ${showMobileFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="md:hidden flex justify-between items-center mb-3">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('dashboard.products.products.categories')}
          </h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-[#1F2A40] text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[40vh] md:max-h-none overflow-y-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory('all')}
            className={`p-1.5 rounded-md cursor-pointer transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : darkMode
                  ? 'bg-gray-800 shadow-sm hover:shadow'
                  : 'bg-white shadow-sm hover:shadow border border-gray-200'
            }`}
          >
            <div className="text-center">
              <h3 className="text-sm font-medium">{t('dashboard.products.products.allProducts')}</h3>
              <p className="text-[10px] opacity-75 mt-0.5">
                {dataSource?.length || 0} {t('dashboard.products.products.products')}
              </p>
            </div>
          </motion.div>

          {categories.map(category => (
            <motion.div
              key={category._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category._id)}
              className={`p-1.5 rounded-md cursor-pointer transition-all duration-300 ${
                selectedCategory === category._id
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : darkMode
                    ? 'bg-gray-800 shadow-sm hover:shadow'
                    : 'bg-white shadow-sm hover:shadow border border-gray-200'
              }`}
            >
              <div className="text-center">
                <h3 className="text-sm font-medium">{category.nom}</h3>
                <p className="text-[10px] opacity-75 mt-0.5">
                  {category.productCount} {t('dashboard.products.products.products')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMobileFilters(true)}
        className="fixed right-4 bottom-4 md:hidden z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        style={{
          boxShadow: darkMode
            ? '0 4px 12px rgba(55, 104, 229, 0.4), 0 0 0 2px rgba(55, 104, 229, 0.2)'
            : '0 4px 12px rgba(55, 104, 229, 0.25)'
        }}
      >
        <FiFilter className="w-6 h-6" />
      </motion.button>

      {/* Overlay for mobile filters */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary ${
            darkMode ? 'opacity-80' : 'opacity-100'
          }`}></div>
        </div>
      ) : filteredProducts?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '1rem',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(55, 104, 229, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
            backgroundColor: darkMode ? 'rgba(17, 25, 40, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            overflow: 'auto',
            maxWidth: '100%',
            '& .MuiTableCell-root': {
              borderColor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(226, 232, 240, 0.8)'
            }
          }}
          className="responsive-table"
        >
          <Table sx={{ minWidth: { xs: '800px', md: '100%' } }}>
            <TableHead>
              <TableRow sx={{
                backgroundColor: darkMode
                  ? 'rgba(55, 104, 229, 0.15)'
                  : 'rgba(59, 130, 246, 0.08)',
                '& .MuiTableCell-head': {
                  borderBottom: darkMode
                    ? '2px solid rgba(55, 104, 229, 0.2)'
                    : '2px solid rgba(59, 130, 246, 0.2)'
                }
              }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all products' }}
                  />
                </TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.image')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.name')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.category')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.price')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.promo_price')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.components')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.attributes')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.tags')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.product.visible')}</TableCell>
                <TableCell sx={{
                  color: darkMode ? '#a3bfff' : '#3768e5',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  padding: { xs: '12px 8px', sm: '16px 12px' }
                }}>{t('dashboard.tables.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow
                  key={product._id}
                  sx={{
                    backgroundColor: darkMode
                      ? index % 2 === 0 ? 'rgba(17, 25, 40, 0.8)' : 'rgba(26, 32, 53, 0.5)'
                      : index % 2 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(247, 250, 252, 0.8)',
                    '&:hover': {
                      backgroundColor: darkMode
                        ? 'rgba(55, 104, 229, 0.08)'
                        : 'rgba(59, 130, 246, 0.05)'
                    },
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                  selected={selectedProducts.includes(product._id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectOne(product._id)}
                      inputProps={{ 'aria-label': `select product ${product.nom}` }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden ${darkMode ? 'ring-2 ring-gray-700/30' : 'ring-1 ring-gray-200'}`}>
                      <img
                        src={product.image.url}
                        alt={product.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex flex-col">
                      <span className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.nom}
                      </span>
                      {product.description && (
                        <span className={`text-xs mt-1 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {product.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <Chip
                      label={product.categorie.nom}
                      size="small"
                      sx={{
                        backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.2)' : 'rgba(55, 104, 229, 0.1)',
                        color: '#3768e5',
                        borderColor: darkMode ? 'rgba(55, 104, 229, 0.3)' : 'transparent',
                        '& .MuiChip-label': {
                          color: darkMode ? '#a3bfff' : '#3768e5',
                          fontSize: { xs: '0.65rem', sm: '0.7rem' }
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-500'}`}>{product.prix}</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dashboard.tables.product.currency.format')}</span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    {product.promo_prix ? (
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>{product.promo_prix}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('dashboard.tables.product.currency.format')}</span>
                      </div>
                    ) : <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>-</span>}
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    {product.composant && product.composant.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {product.composant.map((comp, index) => (
                          <Chip
                            key={index}
                            label={comp}
                            size="small"
                            sx={{
                              height: '20px',
                              backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.8)',
                              color: darkMode ? '#e5e7eb' : '#374151',
                              border: darkMode ? '1px solid rgba(75, 85, 99, 0.3)' : 'none',
                              '& .MuiChip-label': {
                                px: 1,
                                py: 0.25,
                                fontSize: '0.7rem'
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('dashboard.products.products.noComponents')}
                      </span>
                    )}
                  </TableCell>
                  {/* Attributes Column */}
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {/* Vegetarian */}
                      {product.isVegetarian && (
                        <Chip
                          label={t('dashboard.tables.product.vegetarian')}
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                            color: darkMode ? '#34d399' : '#047857',
                            border: darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              fontSize: '0.7rem'
                            }
                          }}
                        />
                      )}

                      {/* Spicy */}
                      {product.isSpicy && (
                        <Chip
                          label={t('dashboard.tables.product.spicy')}
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                            color: darkMode ? '#f87171' : '#b91c1c',
                            border: darkMode ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              fontSize: '0.7rem'
                            }
                          }}
                        />
                      )}

                      {/* Halal */}
                      {product.isHalal && (
                        <Chip
                          label={t('dashboard.tables.product.halal')}
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                            color: darkMode ? '#93c5fd' : '#1d4ed8',
                            border: darkMode ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              fontSize: '0.7rem'
                            }
                          }}
                        />
                      )}

                      {/* Best Product */}
                      {product.isBest && (
                        <Chip
                          label={t('dashboard.tables.product.best') || 'Best'}
                          size="small"
                          icon={<FiStar size={12} />}
                          sx={{
                            height: '20px',
                            backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
                            color: darkMode ? '#fbbf24' : '#d97706',
                            border: darkMode ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              fontSize: '0.7rem'
                            },
                            '& .MuiChip-icon': {
                              color: darkMode ? '#fbbf24' : '#d97706',
                              marginLeft: '4px',
                              marginRight: '-2px'
                            }
                          }}
                        />
                      )}

                      {/* Calories */}
                      {product.calories && (
                        <Chip
                          label={`${product.calories} ${t('dashboard.tables.product.calories')}`}
                          size="small"
                          sx={{
                            height: '20px',
                            backgroundColor: darkMode ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.1)',
                            color: darkMode ? '#c4b5fd' : '#5b21b6',
                            border: darkMode ? '1px solid rgba(124, 58, 237, 0.3)' : 'none',
                            '& .MuiChip-label': {
                              px: 1,
                              py: 0.25,
                              fontSize: '0.7rem'
                            }
                          }}
                        />
                      )}
                    </div>
                  </TableCell>

                  {/* Tags Column - Separated from Attributes */}
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {product.tags && product.tags.length > 0 ? (
                        <>
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                height: '20px',
                                backgroundColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
                                color: darkMode ? '#e5e7eb' : '#374151',
                                border: darkMode ? '1px solid rgba(75, 85, 99, 0.3)' : 'none',
                                '& .MuiChip-label': {
                                  px: 1,
                                  py: 0.25,
                                  fontSize: '0.7rem'
                                }
                              }}
                            />
                          ))}
                          {product.tags.length > 2 && (
                            <Chip
                              label={`+${product.tags.length - 2}`}
                              size="small"
                              sx={{
                                height: '20px',
                                backgroundColor: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.5)',
                                color: darkMode ? '#9ca3af' : '#6b7280',
                                border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : 'none',
                                '& .MuiChip-label': {
                                  px: 1,
                                  py: 0.25,
                                  fontSize: '0.7rem'
                                }
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <span className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          -
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        product.visible
                          ? darkMode ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-green-100 text-green-800'
                          : darkMode ? 'bg-red-900/30 text-red-400 border border-red-800/30' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.visible ? (
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></span>
                            {t('dashboard.products.products.active')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-red-400' : 'bg-red-500'}`}></span>
                            {t('dashboard.products.products.hidden')}
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px', sm: '12px' } }}>
                    <div className="flex gap-1 sm:gap-2">
                      <Tooltip title={product.visible ? t('dashboard.products.products.hide') : t('dashboard.products.products.show')}>
                        <IconButton
                          size="small"
                          sx={{
                            color: product.visible ? '#10b981' : '#ef4444',
                            backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                            border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                            padding: { xs: '4px', sm: '6px' },
                            '&:hover': {
                              color: product.visible ? '#047857' : '#b91c1c',
                              backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                              transform: 'scale(1.1)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                          onClick={() => onToggleVisibility && onToggleVisibility(product._id)}
                        >
                          {product.visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={product.isBest ? t('dashboard.products.products.unmarkBest') || 'Remove from best' : t('dashboard.products.products.markBest') || 'Mark as best'}>
                        <IconButton
                          size="small"
                          sx={{
                            color: product.isBest ? '#f59e0b' : '#6b7280',
                            backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                            border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                            padding: { xs: '4px', sm: '6px' },
                            '&:hover': {
                              color: product.isBest ? '#d97706' : '#f59e0b',
                              backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                              transform: 'scale(1.1)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                          onClick={() => onToggleIsBest && onToggleIsBest(product._id)}
                        >
                          <FiStar size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('dashboard.tables.edit')}>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#10b981',
                            backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                            border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                            padding: { xs: '4px', sm: '6px' },
                            '&:hover': {
                              color: '#047857',
                              backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                              transform: 'scale(1.1)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                          onClick={() => onEdit && onEdit(product)}
                        >
                          <FiEdit2 size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('dashboard.products.products.delete')}>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#ef4444',
                            backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                            border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                            padding: { xs: '4px', sm: '6px' },
                            '&:hover': {
                              color: '#b91c1c',
                              backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                              transform: 'scale(1.1)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                          onClick={() => handleSingleDelete(product._id)}
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div
          className="p-8 rounded-xl text-center"
          style={{
            backgroundColor: darkMode ? 'rgba(17, 25, 40, 0.8)' : 'rgba(249, 250, 251, 0.9)',
            border: darkMode ? '1px solid rgba(55, 104, 229, 0.15)' : '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(55, 104, 229, 0.05)'
              : '0 8px 32px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="mb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                border: darkMode ? '1px solid rgba(55, 104, 229, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke={darkMode ? '#a3bfff' : '#3768e5'}
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </motion.div>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('dashboard.products.products.noProducts')}</h3>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{t('dashboard.products.products.addFirst')}</p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: darkMode ? '0 6px 20px rgba(55, 104, 229, 0.4)' : '0 6px 20px rgba(55, 104, 229, 0.25)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('button[data-add-product]')?.click()}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md"
            style={{
              boxShadow: darkMode ? '0 4px 12px rgba(55, 104, 229, 0.3)' : '0 4px 12px rgba(55, 104, 229, 0.2)',
              border: '1px solid rgba(55, 104, 229, 0.3)'
            }}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('dashboard.products.products.add')}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
