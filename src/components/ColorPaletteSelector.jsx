import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Box, IconButton, Typography, Button, Grid } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { colorPalettes, getPaletteNames } from '../config/colorPalettes';
import { FiSettings, FiCheck, FiX } from 'react-icons/fi';

const ColorPaletteSelector = ({ className = '' }) => {
  const { darkMode, colorPalette, setColorPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(colorPalette);

  const paletteNames = getPaletteNames();

  const handlePaletteSelect = (paletteKey) => {
    setSelectedPalette(paletteKey);
  };

  const handleApply = () => {
    setColorPalette(selectedPalette);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedPalette(colorPalette);
    setIsOpen(false);
  };

  // Get preview colors for a palette
  const getPreviewColors = (paletteKey) => {
    const palette = colorPalettes[paletteKey];
    const colors = darkMode ? palette.dark : palette.light;
    return {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.backgroundSecondary
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{
          scale: 1.1,
          boxShadow: darkMode
            ? "0 0 20px rgba(168, 85, 247, 0.4)"
            : "0 0 20px rgba(147, 51, 234, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          console.log('Color palette button clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
        className={`p-3 sm:p-4 rounded-full transition-all duration-300 shadow-xl border-2 ${
          darkMode
            ? 'bg-gray-800/90 text-purple-400 hover:bg-gray-700/90 border-purple-400/30 hover:border-purple-400/50'
            : 'bg-white/90 text-purple-700 hover:bg-purple-50/90 border-purple-300/50 hover:border-purple-400/70'
        }`}
        style={{
          backdropFilter: 'blur(10px)',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(168, 85, 247, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(147, 51, 234, 0.2)'
        }}
        aria-label="Change color palette"
        title="Change color palette"
      >
        <FiSettings className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* MUI Modal */}
      <Modal
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="color-palette-modal-title"
        aria-describedby="color-palette-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: darkMode ? 'grey.900' : 'background.paper',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 3,
            boxShadow: 24,
            outline: 'none'
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiSettings style={{
                  fontSize: '1.5rem',
                  color: darkMode ? '#a78bfa' : '#7c3aed'
                }} />
                <Typography
                  id="color-palette-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ color: darkMode ? 'white' : 'text.primary', fontWeight: 'bold' }}
                >
                  Choose Color Palette
                </Typography>
              </Box>
              <IconButton onClick={handleCancel} size="small">
                <FiX style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
              </IconButton>
            </Box>
            <Typography
              id="color-palette-modal-description"
              variant="body2"
              sx={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              Select a color theme that matches your business style. Changes apply to the entire profile.
            </Typography>
          </Box>

          {/* Palette Grid */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {paletteNames.map((paletteKey) => {
                const palette = colorPalettes[paletteKey];
                const previewColors = getPreviewColors(paletteKey);
                const isSelected = selectedPalette === paletteKey;
                const isCurrent = colorPalette === paletteKey;

                return (
                  <Grid item xs={12} sm={6} key={paletteKey}>
                    <Box
                      onClick={() => handlePaletteSelect(paletteKey)}
                      sx={{
                        position: 'relative',
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isSelected
                          ? darkMode ? '2px solid #a78bfa' : '2px solid #7c3aed'
                          : darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
                        bgcolor: isSelected
                          ? darkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(124, 58, 237, 0.05)'
                          : darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      {/* Current Badge */}
                      {isCurrent && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                            color: darkMode ? '#4ade80' : '#16a34a',
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          Current
                        </Box>
                      )}

                      {/* Color Preview */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: previewColors.primary,
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                          />
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: previewColors.secondary,
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                          />
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: previewColors.accent,
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                          />
                        </Box>
                        {isSelected && (
                          <FiCheck style={{
                            fontSize: '1rem',
                            color: darkMode ? '#a78bfa' : '#7c3aed',
                            marginLeft: 'auto'
                          }} />
                        )}
                      </Box>

                      {/* Palette Info */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 0.5,
                          color: darkMode ? 'white' : 'text.primary'
                        }}
                      >
                        {palette.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {palette.description}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Footer */}
          <Box sx={{
            p: 3,
            borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5
          }}>
            <Button
              onClick={handleCancel}
              variant="text"
              sx={{
                color: darkMode ? '#9ca3af' : '#6b7280',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={selectedPalette === colorPalette}
              variant="contained"
              sx={{
                bgcolor: selectedPalette === colorPalette
                  ? (darkMode ? '#374151' : '#e5e7eb')
                  : '#7c3aed',
                color: selectedPalette === colorPalette
                  ? (darkMode ? '#6b7280' : '#9ca3af')
                  : 'white',
                '&:hover': {
                  bgcolor: selectedPalette === colorPalette
                    ? (darkMode ? '#374151' : '#e5e7eb')
                    : '#6d28d9'
                },
                '&:disabled': {
                  cursor: 'not-allowed'
                }
              }}
            >
              Apply Theme
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ColorPaletteSelector;
