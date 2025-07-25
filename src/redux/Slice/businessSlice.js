import { createSlice } from '@reduxjs/toolkit';

// Safe JSON parsing function for localStorage
function safeParse(item) {
  try {
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}

// Get the selected business from localStorage
let storedBusiness = null;
try {
  const storedBusinessString = localStorage.getItem('selectedBusiness');
  if (storedBusinessString) {
    storedBusiness = safeParse(storedBusinessString);
  }
} catch (error) {
  // Silent error handling
}

const initialState = {
  businesses: [],
  selectedBusiness: storedBusiness, // Use the business from localStorage if available
  currentBusiness: null, // Business details fetched by ID
  similarBusinesses: [], // Similar businesses based on type
  businessTypes: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    hasNextPage: false,
    hasPrevPage: false
  },
  ratings: {
    hasRated: false,
    positive: 0,
    negative: 0,
    percentage: 0,
    total: 0
  },
  loading: false,
  ratingLoading: false,
  error: null,
  success: false,
  message: ''
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    // Request started
    businessRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all businesses with pagination
    getBusinessesSuccess: (state, action) => {
      state.loading = false;

      // Handle both old and new response formats
      if (action.payload.businesses && action.payload.pagination) {
        // New format with pagination
        state.businesses = action.payload.businesses;
        state.pagination = action.payload.pagination;
      } else {
        // Old format (for backward compatibility)
        state.businesses = action.payload;
      }

      state.success = true;
    },

    // Get business by ID
    getBusinessSuccess: (state, action) => {
      state.loading = false;
      state.currentBusiness = action.payload;
      state.success = true;
    },

    // Get similar businesses
    getSimilarBusinessesSuccess: (state, action) => {
      state.loading = false;
      state.similarBusinesses = action.payload.similarBusinesses;
      state.success = true;
    },

    // Rating actions
    ratingRequestStart: (state) => {
      state.ratingLoading = true;
      state.error = null;
    },

    // Check if user has already rated
    checkRatingStatusSuccess: (state, action) => {
      state.ratingLoading = false;
      state.ratings = {
        hasRated: action.payload.hasRated,
        positive: action.payload.ratings.positive,
        negative: action.payload.ratings.negative,
        percentage: action.payload.ratings.percentage,
        total: action.payload.ratings.total
      };
      state.success = true;
    },

    // Rate a business
    rateBusinessSuccess: (state, action) => {
      state.ratingLoading = false;
      state.ratings = {
        hasRated: true,
        positive: action.payload.ratings.positive,
        negative: action.payload.ratings.negative,
        percentage: action.payload.ratings.percentage,
        total: action.payload.ratings.total
      };

      // Also update the current business ratings if it matches
      if (state.currentBusiness && state.currentBusiness._id === action.payload.businessId) {
        state.currentBusiness.ratings = {
          positive: action.payload.ratings.positive,
          negative: action.payload.ratings.negative,
          percentage: action.payload.ratings.percentage,
          total: action.payload.ratings.total
        };
      }

      state.success = true;
    },

    // Get business types
    getBusinessTypesSuccess: (state, action) => {
      state.loading = false;
      state.businessTypes = action.payload;
      state.success = true;
    },

    // Create business
    createBusinessSuccess: (state, action) => {
      state.loading = false;
      state.businesses.push(action.payload);
      state.selectedBusiness = action.payload;
      state.success = true;
      state.message = 'Business created successfully';
    },

    // Update business
    updateBusinessSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Business updated successfully';
      state.currentBusiness = action.payload;

      // Update in businesses array
      const index = state.businesses.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.businesses[index] = action.payload;
      }

      // Update selectedBusiness if it's the same business
      if (state.selectedBusiness && state.selectedBusiness._id === action.payload._id) {
        state.selectedBusiness = action.payload;
      }
    },

    // Delete business
    deleteBusinessSuccess: (state, action) => {
      state.loading = false;
      state.businesses = state.businesses.filter(business => business._id !== action.payload);
      state.selectedBusiness = null;
      state.success = true;
      state.message = 'Business deleted successfully';
    },

    // Request failure
    businessRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Clear state
    clearBusinessState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Set selected business
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },

    // Reset state to initial values
    resetBusinessState: () => initialState
  }
});

export const {
  businessRequestStart,
  getBusinessesSuccess,
  getBusinessSuccess,
  getSimilarBusinessesSuccess,
  getBusinessTypesSuccess,
  createBusinessSuccess,
  updateBusinessSuccess,
  deleteBusinessSuccess,
  businessRequestFailure,
  clearBusinessState,
  setSelectedBusiness,
  resetBusinessState,
  ratingRequestStart,
  checkRatingStatusSuccess,
  rateBusinessSuccess
} = businessSlice.actions;

export default businessSlice.reducer;
