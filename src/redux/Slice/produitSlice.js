import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  produits: [],
  currentProduit: null,
  produitsByCategorie: [],
  produitsByMenu: [],
  bestProducts: [],
  ratings: {
    hasRated: false,
    positive: 0,
    negative: 0,
    percentage: 0,
    total: 0
  },
  loading: false,
  ratingLoading: false,
  bestProductsLoading: false,
  error: null,
  bestProductsError: null,
  success: false,
  message: ''
};

const produitSlice = createSlice({
  name: 'produit',
  initialState,
  reducers: {
    // Request started
    produitRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all products
    getProduitsSuccess: (state, action) => {
      state.loading = false;
      state.produits = action.payload;
      state.success = true;
    },

    // Get product by ID
    getProduitSuccess: (state, action) => {
      state.loading = false;
      state.currentProduit = action.payload;
      state.success = true;
    },

    // Get products by category
    getProduitsByCategorieSuccess: (state, action) => {
      state.loading = false;
      state.produitsByCategorie = action.payload;
      state.success = true;
    },

    // Add new reducer for getting products by menu
    getProduitsByMenuSuccess: (state, action) => {
      state.loading = false;
      state.produitsByMenu = action.payload;
      state.success = true;
    },

    // Create product
    createProduitSuccess: (state, action) => {
      state.loading = false;
      state.produits.push(action.payload);
      state.currentProduit = action.payload;
      state.success = true;
      state.message = 'Product created successfully';

      // Add to produitsByCategorie if it matches the current category
      if (state.produitsByCategorie.length > 0 && state.produitsByCategorie[0].categorie === action.payload.categorie) {
        state.produitsByCategorie.push(action.payload);
      }
    },

    // Update product
    updateProduitSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Product updated successfully';
      state.currentProduit = action.payload;

      // Update in produits array if exists
      const index = state.produits.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.produits[index] = action.payload;
      }

      // Update in produitsByCategorie array if exists
      const categorieIndex = state.produitsByCategorie.findIndex(p => p._id === action.payload._id);
      if (categorieIndex !== -1) {
        state.produitsByCategorie[categorieIndex] = action.payload;
      }
    },

    // Toggle product visibility
    toggleProduitVisibleSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Product visibility toggled successfully';
      state.currentProduit = action.payload;

      // Update in produits array if exists
      const index = state.produits.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.produits[index] = action.payload;
      }

      // Update in produitsByCategorie array if exists
      const categorieIndex = state.produitsByCategorie.findIndex(p => p._id === action.payload._id);
      if (categorieIndex !== -1) {
        state.produitsByCategorie[categorieIndex] = action.payload;
      }
    },

    // Delete product
    deleteProduitSuccess: (state, action) => {
      state.loading = false;
      state.produits = state.produits.filter(produit => produit._id !== action.payload);
      state.produitsByCategorie = state.produitsByCategorie.filter(produit => produit._id !== action.payload);
      state.currentProduit = null;
      state.success = true;
      state.message = 'Product deleted successfully';
    },

    // Request failure
    produitRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Rating request started
    ratingRequestStart: (state) => {
      state.ratingLoading = true;
      state.error = null;
    },

    // Check rating status success
    checkRatingStatusSuccess: (state, action) => {
      state.ratingLoading = false;
      state.ratings = {
        hasRated: action.payload.hasRated,
        positive: action.payload.ratings.positive,
        negative: action.payload.ratings.negative,
        percentage: action.payload.ratings.percentage,
        total: action.payload.ratings.total
      };
    },

    // Rate product success
    rateProduitSuccess: (state, action) => {
      state.ratingLoading = false;
      state.ratings = {
        hasRated: true,
        positive: action.payload.ratings.positive,
        negative: action.payload.ratings.negative,
        percentage: action.payload.ratings.percentage,
        total: action.payload.ratings.total
      };
      state.success = true;
      state.message = 'Product rated successfully';

      // Update the current product if it matches
      if (state.currentProduit && state.currentProduit._id === action.payload.productId) {
        state.currentProduit.ratings = action.payload.ratings;
      }

      // Update in produits array if exists
      const index = state.produits.findIndex(p => p._id === action.payload.productId);
      if (index !== -1) {
        state.produits[index].ratings = action.payload.ratings;
      }

      // Update in produitsByCategorie array if exists
      const categorieIndex = state.produitsByCategorie.findIndex(p => p._id === action.payload.productId);
      if (categorieIndex !== -1) {
        state.produitsByCategorie[categorieIndex].ratings = action.payload.ratings;
      }

      // Update in produitsByMenu array if exists
      const menuIndex = state.produitsByMenu.findIndex(p => p._id === action.payload.productId);
      if (menuIndex !== -1) {
        state.produitsByMenu[menuIndex].ratings = action.payload.ratings;
      }
    },

    // Get best products success
    getBestProductsSuccess: (state, action) => {
      state.bestProductsLoading = false;
      state.bestProducts = action.payload;
      state.bestProductsError = null;
      state.success = true;
    },

    // Get best products failure
    getBestProductsFailure: (state, action) => {
      state.bestProductsLoading = false;
      state.bestProductsError = action.payload;
      state.success = false;
    },

    // Toggle isBest success
    toggleIsBestSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Product best status toggled successfully';
      state.currentProduit = action.payload.produit;

      // Update in produits array if exists
      const index = state.produits.findIndex(p => p._id === action.payload.produit._id);
      if (index !== -1) {
        state.produits[index] = action.payload.produit;
      }

      // Update in produitsByCategorie array if exists
      const categorieIndex = state.produitsByCategorie.findIndex(p => p._id === action.payload.produit._id);
      if (categorieIndex !== -1) {
        state.produitsByCategorie[categorieIndex] = action.payload.produit;
      }

      // Update in produitsByMenu array if exists
      const menuIndex = state.produitsByMenu.findIndex(p => p._id === action.payload.produit._id);
      if (menuIndex !== -1) {
        state.produitsByMenu[menuIndex] = action.payload.produit;
      }

      // Update in bestProducts array if exists
      const bestIndex = state.bestProducts.findIndex(p => p._id === action.payload.produit._id);
      if (bestIndex !== -1) {
        if (action.payload.produit.isBest) {
          state.bestProducts[bestIndex] = action.payload.produit;
        } else {
          // Remove from best products if no longer marked as best
          state.bestProducts.splice(bestIndex, 1);
        }
      } else if (action.payload.produit.isBest) {
        // Add to best products if newly marked as best
        state.bestProducts.push(action.payload.produit);
      }
    },

    // Clear state
    clearProduitState: (state) => {
      state.loading = false;
      state.ratingLoading = false;
      state.bestProductsLoading = false;
      state.error = null;
      state.bestProductsError = null;
      state.success = false;
      state.message = '';
    },

    // Reset state to initial values
    resetProduitState: () => initialState,

    bulkDeleteProduitsStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    bulkDeleteProduitsSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Products deleted successfully';
      const deletedIds = action.payload;
      state.produits = state.produits.filter(produit => !deletedIds.includes(produit._id));
      state.produitsByCategorie = state.produitsByCategorie.filter(produit => !deletedIds.includes(produit._id));
      if (state.currentProduit && deletedIds.includes(state.currentProduit._id)) {
        state.currentProduit = null;
      }
    },
    bulkDeleteProduitsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    }
  }
});

export const {
  produitRequestStart,
  getProduitsSuccess,
  getProduitSuccess,
  getProduitsByCategorieSuccess,
  getProduitsByMenuSuccess,
  createProduitSuccess,
  updateProduitSuccess,
  toggleProduitVisibleSuccess,
  deleteProduitSuccess,
  produitRequestFailure,
  ratingRequestStart,
  checkRatingStatusSuccess,
  rateProduitSuccess,
  getBestProductsSuccess,
  getBestProductsFailure,
  toggleIsBestSuccess,
  clearProduitState,
  resetProduitState,
  bulkDeleteProduitsStart,
  bulkDeleteProduitsSuccess,
  bulkDeleteProduitsFailure
} = produitSlice.actions;

export default produitSlice.reducer;
