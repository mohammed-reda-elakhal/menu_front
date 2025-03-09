import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Switch, TextField } from '@mui/material';
import { FiSave } from 'react-icons/fi';

const MenuSettings = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [menuData, setMenuData] = useState({
    title: 'My Restaurant Menu',
    description: 'Discover our delicious selection of dishes',
    isPublished: true,
    template: 'modern', // Default template
  });

  const templates = [
    { id: 'modern', name: 'Modern', preview: '🎨' },
    { id: 'classic', name: 'Classic', preview: '📜' },
    { id: 'minimal', name: 'Minimal', preview: '⚡' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTogglePublish = () => {
    setMenuData(prev => ({
      ...prev,
      isPublished: !prev.isPublished
    }));
  };

  const handleTemplateChange = (templateId) => {
    setMenuData(prev => ({
      ...prev,
      template: templateId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving menu settings:', menuData);
  };

  const inputLabelProps = {
    sx: {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#fff',
      },
      fontWeight: '500',
      fontSize: '1rem',
    },
  };

  return (
    <div className="p-4 space-y-6">
      {isRTL ? (
        <div className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.menuSettings.title')}</h2>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <TextField
                fullWidth
                name="title"
                label={t('dashboard.menuSettings.menuTitle')}
                value={menuData.title}
                onChange={handleChange}
                variant="filled"
                className="bg-secondary1/30"
                InputLabelProps={inputLabelProps}
                sx={{
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                name="description"
                label={t('dashboard.menuSettings.menuDescription')}
                value={menuData.description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="filled"
                className="bg-secondary1/30"
                InputLabelProps={inputLabelProps}
                sx={{
                  textarea: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              
              <div className="flex items-center justify-between p-4 bg-secondary1/30 rounded-lg">
                <span className="text-white">{t('dashboard.menuSettings.publishMenu')}</span>
                <Switch
                  checked={menuData.isPublished}
                  onChange={handleTogglePublish}
                  color="primary"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h3 className="text-xl text-white">{t('dashboard.menuSettings.chooseTemplate')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      menuData.template === template.id
                        ? 'border-primary bg-primary/20'
                        : 'border-primary/20 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{template.preview}</div>
                    <h4 className="text-white font-medium">{template.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
            >
              <FiSave />
              {t('dashboard.menuSettings.saveChanges')}
            </button>
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.menuSettings.title')}</h2>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <TextField
                fullWidth
                name="title"
                label={t('dashboard.menuSettings.menuTitle')}
                value={menuData.title}
                onChange={handleChange}
                variant="outlined"
                className="bg-secondary1/30"
                InputLabelProps={inputLabelProps}
                sx={{
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                name="description"
                label={t('dashboard.menuSettings.menuDescription')}
                value={menuData.description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                className="bg-secondary1/30"
                InputLabelProps={inputLabelProps}
                sx={{
                  textarea: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              
              <div className="flex items-center justify-between p-4 bg-secondary1/30 rounded-lg">
                <span className="text-white">{t('dashboard.menuSettings.publishMenu')}</span>
                <Switch
                  checked={menuData.isPublished}
                  onChange={handleTogglePublish}
                  color="primary"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h3 className="text-xl text-white">{t('dashboard.menuSettings.chooseTemplate')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      menuData.template === template.id
                        ? 'border-primary bg-primary/20'
                        : 'border-primary/20 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{template.preview}</div>
                    <h4 className="text-white font-medium">{template.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
            >
              <FiSave />
              {t('dashboard.menuSettings.saveChanges')}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default MenuSettings;
