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

const SupplementsList = ({ onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplementToDelete, setSupplementToDelete] = useState(null);

  const formatPrice = (price) => {
    return `${price} DH`;
  };

  const supplements = useMemo(() => [
    {
      _id: "sup1",
      nom: "Extra Cheese",
      description: "Premium melted cheese",
      prix: 10,
      visible: true,
      categorie: {
        _id: "cat1",
        nom: "Toppings"
      },
      image: {
        url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?q=80&w=500",
        publicId: "extra_cheese"
      }
    },
    {
      _id: "sup2",
      nom: "BBQ Sauce",
      description: "Sweet and smoky sauce",
      prix: 5,
      visible: true,
      categorie: {
        _id: "cat2",
        nom: "Sauces"
      },
      image: {
        url: "https://images.unsplash.com/photo-1564844536308-50f14456fa7f?q=80&w=500",
        publicId: "bbq_sauce"
      }
    }
  ], []);

  const handleDeleteClick = (supplement) => {
    setSupplementToDelete(supplement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplementToDelete) {
      onDelete(supplementToDelete.id);
      setDeleteDialogOpen(false);
      setSupplementToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setSupplementToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: '#01021b' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.supplement.image')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.supplement.name')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.supplement.category')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.supplement.price')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.supplement.visible')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplements.map((supplement) => (
              <TableRow
                key={supplement._id}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(55, 104, 229, 0.1)' },
                  transition: 'background-color 0.3s'
                }}
              >
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <img
                    src={supplement.image.url}
                    alt={supplement.nom}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <div className="font-medium">{supplement.nom}</div>
                  <div className="text-sm text-gray-400">{supplement.description}</div>
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  {supplement.categorie.nom}
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  {formatPrice(supplement.prix)}
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <Chip
                    label={supplement.visible ? 'Active' : 'Hidden'}
                    color={supplement.visible ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onEdit(supplement)}
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
                      onClick={() => handleDeleteClick(supplement)}
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
        <DialogTitle>
          {t('dashboard.products.supplements.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          {t('dashboard.products.supplements.deleteConfirmMessage', {
            name: supplementToDelete?.name
          })}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#e7e7e7',
              '&:hover': { color: '#757de8' }
            }}
          >
            {t('common.cancel')}
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
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupplementsList;