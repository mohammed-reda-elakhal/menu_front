import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { MdCategory, MdDescription, MdSave, MdImage } from 'react-icons/md';
import { IoCloudDone } from 'react-icons/io5';

const CategoryForm = ({ category, onSubmit, isUpdate = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || null
  });
  const [imagePreview, setImagePreview] = useState(category?.image || '');
  const [imageError, setImageError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setImageError(t('dashboard.forms.category.imageTypeError'));
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setImageError(t('dashboard.forms.category.imageSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Preview */}
      <Box className="mb-4">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Category preview"
            className="w-[350px] h-[350px] object-cover rounded-lg mx-auto mb-2"
          />
        )}
        <input
          accept="image/*"
          type="file"
          id="image-upload"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
        >
          <MdImage className="mr-2 text-white" size={24} />
          <span className="text-white">
            {imagePreview ? t('dashboard.forms.category.changeImage') : t('dashboard.forms.category.addImage')}
          </span>
        </label>

        <Typography variant="body2" color="white" className="mt-2 text-center">
          {t('dashboard.forms.category.imageRequirements')}
        </Typography>
        
        <Box className="mt-2">
          <Typography variant="caption" color="white" component="div" className="text-center">
            • {t('dashboard.forms.category.acceptedFormats')}: JPG, PNG, WebP
          </Typography>
          <Typography variant="caption" color="white" component="div" className="text-center">
            • {t('dashboard.forms.category.maxSize')}: 5MB
          </Typography>
          <Typography variant="caption" color="white" component="div" className="text-center">
            • {t('dashboard.forms.category.recommendedSize')}: 1200x800px
          </Typography>
        </Box>

        {imageError && (
          <Alert severity="error" className="mt-2">
            {imageError}
          </Alert>
        )}
      </Box>

      <TextField
        fullWidth
        label={t('dashboard.forms.category.name')}
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        variant="filled"
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'white' },
          },
          '& .MuiInputLabel-root': { color: 'white' },
        }}
      />

      <TextField
        fullWidth
        label={t('dashboard.forms.category.description')}
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        variant="filled"
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'white' },
          },
          '& .MuiInputLabel-root': { color: 'white' },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<IoCloudDone />}
        className="w-full"
      >
        {isUpdate
          ? t('dashboard.forms.update')
          : t('dashboard.forms.create')}
      </Button>
    </form>
  );
};

export default CategoryForm;
