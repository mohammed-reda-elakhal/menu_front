import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FiFilter, FiX } from 'react-icons/fi';

const SupplementsList = ({ supplements = [], onEdit, onDelete, onToggleVisibility }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplementToDelete, setSupplementToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const formatPrice = (price) => {
    return `${price} DH`;
  };

  const handleDeleteClick = (supplement) => {
    setSupplementToDelete(supplement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplementToDelete) {
      onDelete(supplementToDelete._id);
      setDeleteDialogOpen(false);
      setSupplementToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setSupplementToDelete(null);
  };

  // Get unique categories
  const categories = useMemo(() => {
    if (!supplements) return [];
    const uniqueCategories = new Map();

    supplements.forEach(supplement => {
      if (supplement.categorie && supplement.categorie._id) {
        const categoryId = supplement.categorie._id;
        if (!uniqueCategories.has(categoryId)) {
          uniqueCategories.set(categoryId, {
            _id: categoryId,
            nom: supplement.categorie.nom,
            supplementCount: 1
          });
        } else {
          const category = uniqueCategories.get(categoryId);
          category.supplementCount += 1;
        }
      }
    });

    return Array.from(uniqueCategories.values());
  }, [supplements]);

  // Filter supplements by category
  const filteredSupplements = useMemo(() => {
    return selectedCategory === 'all'
      ? supplements
      : supplements.filter(supplement => supplement.categorie?._id === selectedCategory);
  }, [supplements, selectedCategory]);

  return (
    <div className="space-y-6 relative">
      {/* Categories Section */}
      <div className={`
        fixed inset-x-0 bottom-0 p-4 z-50 transition-transform duration-300 ease-in-out
        transform md:transform-none md:static md:bg-transparent md:p-0
        ${darkMode ? 'bg-[#111827]' : 'bg-white border-t border-gray-200'}
        ${showMobileFilters ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
      `}>
        <div className="md:hidden flex justify-between items-center mb-3">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('dashboard.products.supplements.categories')}
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
              <h3 className="text-sm font-medium">{t('dashboard.products.supplements.allSupplements')}</h3>
              <p className="text-[10px] opacity-75 mt-0.5">
                {supplements.length} {t('dashboard.products.supplements.supplements')}
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
                  {category.supplementCount} {t('dashboard.products.supplements.supplements')}
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

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '1rem',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(55, 104, 229, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
          backgroundColor: darkMode ? 'rgba(17, 25, 40, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          overflow: 'hidden',
          '& .MuiTableCell-root': {
            borderColor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(226, 232, 240, 0.8)'
          }
        }}
      >
        <Table sx={{ minWidth: 650 }}>
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
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.supplement.image')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.supplement.name')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.supplement.category')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.supplement.price')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.supplement.visible')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#a3bfff' : '#3768e5',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '16px 12px'
              }}>
                {t('dashboard.tables.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSupplements.map((supplement, index) => (
              <TableRow
                key={supplement._id}
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
              >
                <TableCell sx={{ padding: '12px' }}>
                  {supplement.image && supplement.image.url ? (
                    <div className={`w-[100px] h-[100px] rounded-lg overflow-hidden ${darkMode ? 'ring-2 ring-gray-700/30' : 'ring-1 ring-gray-200'}`}>
                      <img
                        src={supplement.image.url}
                        alt={supplement.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-[100px] h-[100px] rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('dashboard.products.supplements.noImage')}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell sx={{ padding: '12px', color: darkMode ? '#e7e7e7' : '#1e293b' }}>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {supplement.nom}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {supplement.description}
                  </div>
                </TableCell>
                <TableCell sx={{ padding: '12px', color: darkMode ? '#e7e7e7' : '#1e293b' }}>
                  <Chip
                    label={supplement.categorie && supplement.categorie.nom
                      ? supplement.categorie.nom
                      : t('dashboard.products.uncategorized')
                    }
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.2)' : 'rgba(55, 104, 229, 0.1)',
                      color: darkMode ? '#a3bfff' : '#3768e5',
                      borderColor: darkMode ? 'rgba(55, 104, 229, 0.3)' : 'transparent',
                      '& .MuiChip-label': {
                        color: darkMode ? '#a3bfff' : '#3768e5'
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '12px', color: darkMode ? '#e7e7e7' : '#1e293b' }}>
                  <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                    {formatPrice(supplement.prix)}
                  </span>
                </TableCell>
                <TableCell sx={{ padding: '12px' }}>
                  <Chip
                    label={supplement.visible ? t('dashboard.products.supplements.active') : t('dashboard.products.supplements.hidden')}
                    size="small"
                    onClick={() => onToggleVisibility(supplement._id)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: supplement.visible
                        ? darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'
                        : darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                      color: supplement.visible
                        ? darkMode ? '#34d399' : '#059669'
                        : darkMode ? '#f87171' : '#dc2626',
                      border: supplement.visible
                        ? darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : 'none'
                        : darkMode ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ padding: '12px' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onEdit(supplement)}
                      sx={{
                        color: darkMode ? '#757de8' : '#3768e5',
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                        border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                        '&:hover': {
                          color: darkMode ? '#3768e5' : '#2855c7',
                          backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                          transform: 'scale(1.1)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                      size="small"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(supplement)}
                      sx={{
                        color: darkMode ? '#757de8' : '#3768e5',
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                        border: darkMode ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)',
                        '&:hover': {
                          color: '#dc2626',
                          backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.9)',
                          transform: 'scale(1.1)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                      size="small"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: darkMode ? 'rgba(17, 25, 40, 0.95)' : 'white',
            color: darkMode ? '#e7e7e7' : '#1e293b',
            borderRadius: '0.75rem',
            boxShadow: darkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(55, 104, 229, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }
        }}
      >
        <DialogTitle sx={{
          color: darkMode ? '#e7e7e7' : '#1e293b',
          fontWeight: 600,
          borderBottom: darkMode ? '1px solid rgba(55, 104, 229, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          {t('dashboard.products.supplements.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '16px' }}>
          {t('dashboard.products.supplements.deleteConfirmMessage', {
            name: supplementToDelete?.nom
          })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: darkMode ? '#e7e7e7' : '#64748b',
              '&:hover': {
                color: darkMode ? '#757de8' : '#3768e5',
                backgroundColor: darkMode ? 'rgba(55, 104, 229, 0.08)' : 'rgba(59, 130, 246, 0.05)'
              }
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: darkMode ? '#f87171' : '#dc2626',
              '&:hover': {
                color: darkMode ? '#ef4444' : '#b91c1c',
                backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.05)'
              }
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SupplementsList;