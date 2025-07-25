import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FiX, FiImage, FiDollarSign } from 'react-icons/fi';

const QuickProductModal = ({
  open,
  onClose,
  onSubmit,
  productData,
  categories = [],
  loading = false,
  error = null,
  success = false
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // Initialize with productData if available
    name: productData?.name || '',
    description: productData?.description || '',
    price: productData?.price || '',
    categoryId: productData?.categoryId || '',
    image: null,
    imagePreview: null
  });

  // Update form data when productData changes or when modal opens
  React.useEffect(() => {
    if (productData) {
      setFormData(prev => ({
        ...prev,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        categoryId: productData.categoryId || '',
        image: null,
        imagePreview: null
      }));
    }
  }, [productData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name) {
      alert(t('productForm.nameRequired'));
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      alert(t('productForm.priceRequired'));
      return;
    }

    if (!formData.categoryId) {
      alert(t('productForm.categoryRequired'));
      return;
    }

    if (!formData.image) {
      alert(t('productForm.imageRequired'));
      return;
    }

    onSubmit(formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          bgcolor: darkMode ? 'background.paper' : 'white'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {t('productModal.title')}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ color: 'text.secondary' }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            {/* Left side - Form fields */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label={t('productForm.name')}
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>
                      <Typography variant="body2" component="span" sx={{ fontSize: '1.2rem' }}>•</Typography>
                    </Box>
                  ),
                }}
              />

              <TextField
                name="description"
                label={t('productForm.description')}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }}>
                      <Typography variant="body2" component="span" sx={{ fontSize: '1.2rem' }}>•</Typography>
                    </Box>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="price"
                  label={t('productForm.price')}
                  value={formData.price}
                  onChange={handleChange}
                  required
                  type="number"
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>DH</Typography>
                      </Box>
                    ),
                    endAdornment: (
                      <Box sx={{ ml: 1, color: 'text.secondary' }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>DH</Typography>
                      </Box>
                    ),
                    inputProps: { min: 0, step: 0.01 }
                  }}
                />

                <FormControl variant="outlined" size="small" sx={{ flex: 1 }} required>
                  <InputLabel id="category-select-label">{t('productForm.category')}</InputLabel>
                  <Select
                    labelId="category-select-label"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    label={t('productForm.category')}
                  >
                    <MenuItem value="">{t('productForm.selectCategory')}</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Right side - Image upload */}
            <Box sx={{
              width: { xs: '100%', sm: 150 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2
            }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {formData.imagePreview ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={formData.imagePreview}
                    alt="Product preview"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={triggerFileInput}
                    startIcon={<FiImage size={14} />}
                    sx={{ mt: 1, fontSize: '0.75rem' }}
                  >
                    {t('productForm.changeImage')}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={triggerFileInput}
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 1,
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <FiImage size={30} />
                  </IconButton>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {t('productForm.addImage')}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    (JPG, PNG, WebP - 1MB)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Status messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {t('productForm.success', {
                price: formData.price,
                currency: 'DH'
              }) || `Product created successfully - ${formData.price} DH`}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? t('common.creating') : t('productForm.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuickProductModal;
