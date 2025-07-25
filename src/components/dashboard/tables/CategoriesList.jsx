import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from '../../../context/ThemeContext';

const CategoriesList = ({ categories, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Handle both array and nested object structures
  const categoriesData = Array.isArray(categories)
    ? categories
    : categories?.categories || [];

  console.log('Processed categories:', categoriesData);

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete._id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{
        bgcolor: darkMode ? '#01021b' : '#ffffff',
        boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
      }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: darkMode ? 'rgba(1, 2, 27, 0.8)' : 'rgba(59, 130, 246, 0.05)' }}>
              <TableCell sx={{
                color: darkMode ? '#e7e7e7' : '#1e293b',
                fontWeight: 'bold',
                borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
              }}>
                {t('dashboard.tables.category.image')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#e7e7e7' : '#1e293b',
                fontWeight: 'bold',
                borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
              }}>
                {t('dashboard.tables.category.name')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#e7e7e7' : '#1e293b',
                fontWeight: 'bold',
                borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
              }}>
                {t('dashboard.tables.category.description')}
              </TableCell>
              <TableCell sx={{
                color: darkMode ? '#e7e7e7' : '#1e293b',
                fontWeight: 'bold',
                borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
              }}>
                {t('dashboard.tables.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{
                  color: darkMode ? '#e7e7e7' : '#64748b',
                  textAlign: 'center',
                  py: 4,
                  borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
                }}>
                  <div className="flex flex-col items-center justify-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {t('dashboard.products.categories.noCategories') || 'No categories found'}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('dashboard.products.categories.addFirst') || 'Create your first category to get started'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categoriesData.map((category) => (
                <TableRow
                  key={category._id}
                  sx={{
                    '&:hover': { bgcolor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(59, 130, 246, 0.05)' },
                    transition: 'background-color 0.3s'
                  }}
                >
                  <TableCell sx={{
                    color: darkMode ? '#e7e7e7' : '#1e293b',
                    borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
                  }}>
                    <img
                      src={category.image?.url || '/placeholder-image.jpg'}
                      alt={category.nom || category.name}
                      className="w-[100px] h-[100px] object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell sx={{
                    color: darkMode ? '#e7e7e7' : '#1e293b',
                    borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
                  }}>
                    {category.nom || category.name}
                  </TableCell>
                  <TableCell sx={{
                    color: darkMode ? '#e7e7e7' : '#1e293b',
                    borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
                  }}>
                    {category.description}
                  </TableCell>
                  <TableCell sx={{
                    borderBottom: darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(226, 232, 240, 1)'
                  }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => onEdit(category)}
                        sx={{
                          color: '#3768e5',
                          '&:hover': {
                            color: darkMode ? '#3768e5' : '#1e40af',
                            transform: 'scale(1.1)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                        size="small"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(category)}
                        sx={{
                          color: darkMode ? '#757de8' : '#3768e5',
                          '&:hover': {
                            color: '#dc2626',
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            sx: {
              bgcolor: darkMode ? '#01021b' : '#ffffff',
              color: darkMode ? '#e7e7e7' : '#1e293b',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }
          }
        }}
      >
        <DialogTitle sx={{
          color: darkMode ? '#e7e7e7' : '#1e293b',
          fontWeight: 'bold'
        }}>
          {t('dashboard.common.confirmDelete') || 'Confirm Delete'}
        </DialogTitle>
        <DialogContent>
          <div className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('dashboard.common.deleteConfirmation', { name: categoryToDelete?.nom || categoryToDelete?.name }) ||
              `Are you sure you want to delete ${categoryToDelete?.nom || categoryToDelete?.name}?`}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: darkMode ? '#e7e7e7' : '#64748b',
              '&:hover': {
                color: darkMode ? '#757de8' : '#3768e5',
                bgcolor: darkMode ? 'rgba(55, 104, 229, 0.1)' : 'rgba(59, 130, 246, 0.05)'
              }
            }}
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: '#dc2626',
              '&:hover': {
                color: '#ef4444',
                bgcolor: 'rgba(220, 38, 38, 0.1)'
              }
            }}
          >
            {t('common.delete') || 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesList;
