import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  currentCategorie: null,
  categoriesByMenu: [],
  loading: false,
  error: null,
  success: false,
  message: ''
};

const categorieSlice = createSlice({
  name: 'categorie',
  initialState,
  reducers: {
    // Request started
    categorieRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all categories
    getCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload.categories;
      state.success = true;
    },

    // Get category by ID
    getCategorieSuccess: (state, action) => {
      state.loading = false;
      state.currentCategorie = action.payload;
      state.success = true;
    },

    // Get categories by menu
    getCategoriesByMenuSuccess: (state, action) => {
      state.loading = false;
      state.categoriesByMenu = action.payload.categories;
      state.success = true;
    },

    // Create category
    createCategorieSuccess: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
      state.currentCategorie = action.payload;
      state.success = true;
      state.message = 'Category created successfully';

      // Add to categoriesByMenu if it matches the current menu
      if (state.categoriesByMenu.length > 0 && state.categoriesByMenu[0].menu === action.payload.menu) {
        state.categoriesByMenu.push(action.payload);
      }
    },

    // Update category
    updateCategorieSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Category updated successfully';
      state.currentCategorie = action.payload;

      // Update in categories array if exists
      const index = state.categories.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }

      // Update in categoriesByMenu array if exists
      const menuIndex = state.categoriesByMenu.findIndex(c => c._id === action.payload._id);
      if (menuIndex !== -1) {
        state.categoriesByMenu[menuIndex] = action.payload;
      }
    },

    // Delete category
    deleteCategorieSuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(categorie => categorie._id !== action.payload);
      state.categoriesByMenu = state.categoriesByMenu.filter(categorie => categorie._id !== action.payload);
      state.currentCategorie = null;
      state.success = true;
      state.message = 'Category deleted successfully';
    },

    // Request failure
    categorieRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Clear state
    clearCategorieState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Reset state to initial values
    resetCategorieState: () => initialState
  }
});

export const {
  categorieRequestStart,
  getCategoriesSuccess,
  getCategorieSuccess,
  getCategoriesByMenuSuccess,
  createCategorieSuccess,
  updateCategorieSuccess,
  deleteCategorieSuccess,
  categorieRequestFailure,
  clearCategorieState,
  resetCategorieState
} = categorieSlice.actions;

export default categorieSlice.reducer;
