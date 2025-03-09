import React, { useMemo, useState } from 'react';
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

const CategoriesList = ({ onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const data = useMemo(
    () => [
      {
        id: 1,
        name: 'Main Dishes',
        description: 'Primary meal options including steaks, pasta, and seafood',
        itemCount: 12,
        image: 'https://picsum.photos/seed/main-dishes/400/400'
      },
      {
        id: 2,
        name: 'Appetizers',
        description: 'Starters and small plates to begin your meal',
        itemCount: 8,
        image: 'https://picsum.photos/seed/appetizers/400/400'
      },
      {
        id: 3,
        name: 'Desserts',
        description: 'Sweet treats and confections to end your meal',
        itemCount: 6,
        image: 'https://picsum.photos/seed/desserts/400/400'
      },
      {
        id: 4,
        name: 'Beverages',
        description: 'Refreshing drinks and cocktails',
        itemCount: 10,
        image: 'https://picsum.photos/seed/beverages/400/400'
      }
    ],
    []
  );

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete.id);
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
      <TableContainer component={Paper} sx={{ bgcolor: '#01021b' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.category.image')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.category.name')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.category.description')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((category) => (
              <TableRow
                key={category.id}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(55, 104, 229, 0.1)' },
                  transition: 'background-color 0.3s'
                }}
              >
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <img
                    src={category.image || '/placeholder-image.jpg'}
                    alt={category.name}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  {category.name}
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  {category.description}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onEdit(category)}
                      sx={{ 
                        color: '#757de8',
                        '&:hover': { 
                          color: '#3768e5',
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
                        color: '#757de8',
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: '#01021b',
            color: '#e7e7e7',
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {categoryToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#e7e7e7',
              '&:hover': { color: '#757de8' }
            }}
          >
            Cancel
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesList;
