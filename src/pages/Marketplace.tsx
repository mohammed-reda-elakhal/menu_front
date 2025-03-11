import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button,
  alpha
} from '@mui/material';
import templates, { TemplateConfig } from '../config/templates';
import { Link } from 'react-router-dom';
import PreviewIcon from '@mui/icons-material/Preview';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiLayout } from 'react-icons/fi';

// Wrap Card with motion
const MotionCard = motion(Card);

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [theme, setTheme] = useState('all');
  const [focusedInput, setFocusedInput] = useState(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || template.category === category;
    const matchesTheme = theme === 'all' || template.style.theme === theme;
    return matchesSearch && matchesCategory && matchesTheme;
  });

  return (
    <div className="min-h-screen bg-secondary1">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[60px]" />
      </div>

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Typography 
            variant="h3" 
            component="h1" 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent"
          >
            Template Marketplace
          </Typography>
          <Typography 
            variant="h6"
            className="text-gray_bg"
          >
            Choose from our collection of beautiful menu templates
          </Typography>
        </motion.div>
        
        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary2/30 rounded-2xl blur-xl opacity-50 transform rotate-6 scale-105" />
          
          <Box className="relative bg-secondary1 p-6 rounded-2xl border border-primary/20 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3 
                    text-white focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all"
                  onFocus={() => setFocusedInput('search')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>

              <div className="relative">
                <FiGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3 
                    text-white focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all appearance-none"
                >
                  <option value="all">All Categories</option>
                  <option value="coffee">Coffee</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="bakery">Bakery</option>
                </select>
              </div>

              <div className="relative">
                <FiLayout className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3 
                    text-white focus:border-primary focus:shadow-lg focus:shadow-primary/10 transition-all appearance-none"
                >
                  <option value="all">All Themes</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>
            </div>
          </Box>
        </motion.div>

        {/* Templates Grid */}
        <Grid container spacing={4}>
          {filteredTemplates.map((template, index) => (
            <Grid item key={template.id} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MotionCard
                  whileHover={{ y: -10 }}
                  className="relative bg-secondary1 rounded-2xl border border-primary/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary2/5" />
                  
                  <Box className="relative">
                    <CardMedia
                      component="img"
                      height="200"
                      image={template.previewImage}
                      alt={template.name}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </Box>

                  <CardContent className="relative p-6">
                    <Typography variant="h6" className="text-white font-bold mb-2">
                      {template.name}
                    </Typography>

                    {/* Description 
                    <Typography className="text-gray_bg mb-4">
                      {template.description}
                    </Typography>
                    */}
                    {/* Category and Theme */}
                    <Stack direction="row" spacing={1} className="mb-4">
                      <Chip 
                        label={template.category}
                        size="small"
                        className="bg-primary/10 text-primary"
                      />
                      <Chip 
                        label={template.style.theme}
                        size="small"
                        className="bg-secondary2/10 text-secondary2"
                      />
                    </Stack>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        component={Link}
                        to={template.demoPath}
                        variant="contained"
                        startIcon={<PreviewIcon />}
                        fullWidth
                        className="bg-primary hover:bg-secondary2 text-white py-3 rounded-xl 
                          font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
                      >
                        View Demo
                      </Button>
                    </motion.div>
                  </CardContent>
                </MotionCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Marketplace;
