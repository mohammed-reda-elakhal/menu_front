import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { MdImage } from 'react-icons/md';
import { IoCloudDone } from 'react-icons/io5';

const SupplementForm = ({ supplement, onSubmit, isUpdate = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nom: supplement?.nom || '',
    description: supplement?.description || '',
    prix: supplement?.prix || '',
    categorie: supplement?.categorie || '',
    image: supplement?.image?.url || null,
    visible: supplement?.visible ?? true
  });
  const [imagePreview, setImagePreview] = useState(supplement?.image?.url || '');
  const [imageError, setImageError] = useState('');

  const categories = [
    { id: 1, name: 'Sauces' },
    { id: 2, name: 'Toppings' },
    { id: 3, name: 'Extra Ingredients' },
    { id: 4, name: 'Condiments' }
  ];

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
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setImageError(t('dashboard.forms.supplement.imageTypeError'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError(t('dashboard.forms.supplement.imageSizeError'));
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
      <Box className="mb-4">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Supplement preview"
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
          className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center">
            <MdImage className="mr-2 text-white" size={24} />
            <span className="text-white">
              {imagePreview ? t('dashboard.forms.supplement.changeImage') : t('dashboard.forms.supplement.addImage')}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-300">
            <p>{t('dashboard.forms.supplement.imageRequirements.format')}</p>
            <p>{t('dashboard.forms.supplement.imageRequirements.size')}</p>
            <p>{t('dashboard.forms.supplement.imageRequirements.recommended')}</p>
          </div>
        </label>

        {imageError && (
          <Alert severity="error" className="mt-2">
            {imageError}
          </Alert>
        )}
      </Box>

      <TextField
        fullWidth
        label={t('dashboard.forms.supplement.name')}
        name="nom"
        value={formData.nom}
        onChange={handleChange}
        required
        variant="filled"
        sx={{ 
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
        }}
      />

      <FormControl fullWidth variant="filled">
        <InputLabel sx={{ color: 'white' }}>{t('dashboard.forms.supplement.category')}</InputLabel>
        <Select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          required
          sx={{ 
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiSelect-icon': { color: 'white' }
          }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label={t('dashboard.forms.supplement.price')}
        name="prix"
        type="number"
        value={formData.prix}
        onChange={handleChange}
        required
        variant="filled"
        sx={{ 
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
        }}
      />

      <TextField
        fullWidth
        label={t('dashboard.forms.supplement.description')}
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        variant="filled"
        sx={{ 
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.visible}
            onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
            name="visible"
          />
        }
        label={t('dashboard.forms.supplement.visible')}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<IoCloudDone />}
        className="w-full"
      >
        {isUpdate
          ? t('common.update')
          : t('common.create')}
      </Button>
    </form>
  );
};

export default SupplementForm;