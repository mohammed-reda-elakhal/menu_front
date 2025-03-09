import { lazy } from 'react';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'coffee' | 'restaurant' | 'bakery';
  previewImage: string;
  features: string[];
  style: {
    theme: 'vintage' | 'modern' | 'minimalist';
    colors: string[];
  };
  component: () => Promise<any>;
}

const templates: TemplateConfig[] = [
  {
    id: 'vintage-coffee',
    name: 'Vintage Coffee House',
    description: 'A classic coffee house template with vintage aesthetics and warm colors.',
    category: 'coffee',
    previewImage: 'https://picsum.photos/seed/vintage-coffee/400/300',
    features: ['Classic typography', 'Warm color scheme', 'Elegant layouts', 'Vintage decorations'],
    style: {
      theme: 'vintage',
      colors: ['#2C1810', '#D4B8A8', '#8B4513']
    },
    component: () => import('../templates/coffee/VintageCoffee')
  },
  {
    id: 'minimalist-coffee',
    name: 'Minimalist Coffee',
    description: 'Clean and minimalistic design focused on simplicity and readability.',
    category: 'coffee',
    previewImage: 'https://picsum.photos/seed/minimalist-coffee/400/300',
    features: ['Minimal design', 'Clean typography', 'Whitespace focused', 'Easy navigation'],
    style: {
      theme: 'minimalist',
      colors: ['#FFFFFF', '#000000', '#F5F5F5']
    },
    component: () => import('../templates/coffee/MinimalistCoffee')
  },
  {
    id: 'modern-coffee',
    name: 'Modern Coffee Lab',
    description: 'Contemporary design with bold typography and modern aesthetics.',
    category: 'coffee',
    previewImage: 'https://picsum.photos/seed/modern-coffee/400/300',
    features: ['Modern layout', 'Bold typography', 'Card-based design', 'Interactive elements'],
    style: {
      theme: 'modern',
      colors: ['#1A1A1A', '#FFFFFF', '#FF6B6B']
    },
    component: () => import('../templates/coffee/ModernCoffee')
  }
];

export default templates;
