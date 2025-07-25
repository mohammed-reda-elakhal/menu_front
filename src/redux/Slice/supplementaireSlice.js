import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supplementaires: [],
  currentSupplementaire: null,
  supplementairesByCategorie: [],
  supplementairesByMenu: [],
  loading: false,
  error: null,
  success: false,
  message: ''
};

const supplementaireSlice = createSlice({
  name: 'supplementaire',
  initialState,
  reducers: {
    // Request started
    supplementaireRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all supplementary items
    getSupplementairesSuccess: (state, action) => {
      state.loading = false;
      state.supplementaires = action.payload;
      state.success = true;
    },

    // Get supplementary item by ID
    getSupplementaireSuccess: (state, action) => {
      state.loading = false;
      state.currentSupplementaire = action.payload;
      state.success = true;
    },

    // Get supplementary items by category
    getSupplementairesByCategorieSuccess: (state, action) => {
      state.loading = false;
      state.supplementairesByCategorie = action.payload;
      state.success = true;
    },

    // Get supplementary items by menu
    getSupplementairesByMenuSuccess: (state, action) => {
      state.loading = false;
      state.supplementairesByMenu = action.payload;
      state.success = true;
    },

    // Create supplementary item
    createSupplementaireSuccess: (state, action) => {
      state.loading = false;
      state.supplementaires.push(action.payload);
      state.currentSupplementaire = action.payload;
      state.success = true;
      state.message = 'Supplementary item created successfully';

      // Add to supplementairesByCategorie if it matches the current category
      if (state.supplementairesByCategorie.length > 0 && state.supplementairesByCategorie[0].categorie === action.payload.categorie) {
        state.supplementairesByCategorie.push(action.payload);
      }
    },

    // Update supplementary item
    updateSupplementaireSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Supplementary item updated successfully';
      state.currentSupplementaire = action.payload;

      // Update in supplementaires array if exists
      const index = state.supplementaires.findIndex(s => s._id === action.payload._id);
      if (index !== -1) {
        state.supplementaires[index] = action.payload;
      }

      // Update in supplementairesByCategorie array if exists
      const categorieIndex = state.supplementairesByCategorie.findIndex(s => s._id === action.payload._id);
      if (categorieIndex !== -1) {
        state.supplementairesByCategorie[categorieIndex] = action.payload;
      }
    },

    // Toggle supplementary item visibility
    toggleSupplementaireVisibleSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Supplementary item visibility toggled successfully';
      state.currentSupplementaire = action.payload;

      // Update in supplementaires array if exists
      const index = state.supplementaires.findIndex(s => s._id === action.payload._id);
      if (index !== -1) {
        state.supplementaires[index] = action.payload;
      }

      // Update in supplementairesByCategorie array if exists
      const categorieIndex = state.supplementairesByCategorie.findIndex(s => s._id === action.payload._id);
      if (categorieIndex !== -1) {
        state.supplementairesByCategorie[categorieIndex] = action.payload;
      }
    },

    // Delete supplementary item
    deleteSupplementaireSuccess: (state, action) => {
      state.loading = false;
      state.supplementaires = state.supplementaires.filter(supplementaire => supplementaire._id !== action.payload);
      state.supplementairesByCategorie = state.supplementairesByCategorie.filter(supplementaire => supplementaire._id !== action.payload);
      state.currentSupplementaire = null;
      state.success = true;
      state.message = 'Supplementary item deleted successfully';
    },

    // Request failure
    supplementaireRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Clear state
    clearSupplementaireState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Reset state to initial values
    resetSupplementaireState: () => initialState
  }
});

export const {
  supplementaireRequestStart,
  getSupplementairesSuccess,
  getSupplementaireSuccess,
  getSupplementairesByCategorieSuccess,
  getSupplementairesByMenuSuccess,
  createSupplementaireSuccess,
  updateSupplementaireSuccess,
  toggleSupplementaireVisibleSuccess,
  deleteSupplementaireSuccess,
  supplementaireRequestFailure,
  clearSupplementaireState,
  resetSupplementaireState
} = supplementaireSlice.actions;

export default supplementaireSlice.reducer;
