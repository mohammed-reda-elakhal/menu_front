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

const ProductsList = ({ onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const formatPrice = (price) => {
    // Simplified price formatting
    return `${price} DH`;
  };

  const products = useMemo(() => [
    {
      _id: "prod1",
      nom: "Café Latte",
      description: "Rich espresso with steamed milk",
      prix: 25,
      promo_prix: 20,
      composant: ["Espresso", "Steamed Milk", "Milk Foam"],
      visible: true,
      review: 4.5,
      categorie: {
        _id: "cat1",
        nom: "Boissons Chaudes"
      },
      image: {
        url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500",
        publicId: "cafe_latte"
      }
    },
    {
      _id: "prod2",
      nom: "Burger Classic",
      description: "Beef patty with fresh vegetables",
      prix: 65,
      promo_prix: null,
      composant: ["Beef", "Lettuce", "Tomato", "Cheese"],
      visible: true,
      review: 4.8,
      categorie: {
        _id: "cat2",
        nom: "Burgers"
      },
      image: {
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
        publicId: "burger_classic"
      }
    },
    {
      _id: "prod3",
      nom: "Salade César",
      description: "Fresh romaine lettuce with caesar dressing",
      prix: 45,
      promo_prix: 38,
      composant: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      visible: false,
      review: 4.2,
      categorie: {
        _id: "cat3",
        nom: "Salades"
      },
      image: {
        url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500",
        publicId: "salade_cesar"
      }
    }
  ], []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const PriceDisplay = ({ prix, promo_prix }) => (
    <div className="flex flex-col">
      {promo_prix ? (
        <>
          <span className="text-green-500 font-medium text-base">
            {formatPrice(promo_prix)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(prix)}
          </span>
        </>
      ) : (
        <span className="font-medium text-base">{formatPrice(prix)}</span>
      )}
    </div>
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: '#01021b' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.product.image')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.product.name')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.product.category')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.product.price')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.product.visible')}
              </TableCell>
              <TableCell sx={{ color: '#e7e7e7', fontWeight: 'bold' }}>
                {t('dashboard.tables.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(55, 104, 229, 0.1)' },
                  transition: 'background-color 0.3s'
                }}
              >
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <img
                    src={product.image.url}
                    alt={product.nom}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <div className="font-medium">{product.nom}</div>
                  <div className="text-sm text-gray-400">{product.description}</div>
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  {product.categorie.nom}
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <PriceDisplay prix={product.prix} promo_prix={product.promo_prix} />
                </TableCell>
                <TableCell sx={{ color: '#e7e7e7' }}>
                  <Chip
                    label={product.visible ? 'Active' : 'Hidden'}
                    color={product.visible ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onEdit(product)}
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
                      onClick={() => handleDeleteClick(product)}
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
          {t('dashboard.products.products.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          {t('dashboard.products.products.deleteConfirmMessage', {
            name: productToDelete?.name
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

export default ProductsList;
