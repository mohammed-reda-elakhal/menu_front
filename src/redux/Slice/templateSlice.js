import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
    hasNextPage: false,
    hasPrevPage: false
  }
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Request started
    templateRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all templates
    getTemplatesSuccess: (state, action) => {
      state.loading = false;
      state.templates = action.payload.templates || action.payload;
      state.pagination = action.payload.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: action.payload.templates?.length || action.payload.length || 0,
        itemsPerPage: 50,
        hasNextPage: false,
        hasPrevPage: false
      };
      state.success = true;
    },

    // Get template by ID
    getTemplateSuccess: (state, action) => {
      state.loading = false;
      state.currentTemplate = action.payload;
      state.success = true;
    },

    // Create template
    createTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templates = [...state.templates, action.payload];
      state.currentTemplate = action.payload;
      state.success = true;
      state.message = 'Template created successfully';
    },

    // Update template
    updateTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templates = state.templates.map(template =>
        template._id === action.payload._id ? action.payload : template
      );
      state.currentTemplate = action.payload;
      state.success = true;
      state.message = 'Template updated successfully';
    },

    // Delete template
    deleteTemplateSuccess: (state, action) => {
      state.loading = false;
      state.templates = state.templates.filter(template => template._id !== action.payload);
      state.success = true;
      state.message = 'Template deleted successfully';
      if (state.currentTemplate && state.currentTemplate._id === action.payload) {
        state.currentTemplate = null;
      }
    },

    // Toggle template published status
    toggleTemplatePublishedSuccess: (state, action) => {
      state.loading = false;
      const { id, isPublished } = action.payload;
      state.templates = state.templates.map(template =>
        template._id === id ? { ...template, isPublished } : template
      );
      if (state.currentTemplate && state.currentTemplate._id === id) {
        state.currentTemplate = { ...state.currentTemplate, isPublished };
      }
      state.success = true;
    },

    // Request failure
    templateRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Clear state
    clearTemplateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Reset state to initial values
    resetTemplateState: () => initialState
  }
});

export const {
  templateRequestStart,
  getTemplatesSuccess,
  getTemplateSuccess,
  createTemplateSuccess,
  updateTemplateSuccess,
  deleteTemplateSuccess,
  toggleTemplatePublishedSuccess,
  templateRequestFailure,
  clearTemplateState,
  resetTemplateState
} = templateSlice.actions;

export default templateSlice.reducer;
