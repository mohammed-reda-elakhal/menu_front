import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menus: [],
  currentMenu: null, // Menu details fetched by ID
  menusByBusiness: [], // Menus for a specific business
  menusByTemplate: [], // Menus for a specific template
  loading: false,
  error: null,
  success: false,
  message: ''
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // Request started
    menuRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Get all menus
    getMenusSuccess: (state, action) => {
      state.loading = false;
      state.menus = action.payload.menus;
      state.success = true;
    },

    // Get menu by ID
    getMenuSuccess: (state, action) => {
      state.loading = false;
      state.currentMenu = action.payload.menu;
      state.success = true;
    },

    // Get menus by business
    getMenusByBusinessSuccess: (state, action) => {
      state.loading = false;
      state.menusByBusiness = action.payload.menus;
      state.success = true;
    },

    // Get menus by template
    getMenusByTemplateSuccess: (state, action) => {
      state.loading = false;
      state.menusByTemplate = action.payload.menus;
      state.success = true;
    },

    // Create menu
    createMenuSuccess: (state, action) => {
      state.loading = false;
      state.menus.push(action.payload.menu);
      state.currentMenu = action.payload.menu;
      state.success = true;
      state.message = 'Menu created successfully';
    },

    // Update menu
    updateMenuSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Menu updated successfully';
      state.currentMenu = action.payload.menu;

      // Update in menus array if exists
      const index = state.menus.findIndex(m => m._id === action.payload.menu._id);
      if (index !== -1) {
        state.menus[index] = action.payload.menu;
      }

      // Update in menusByBusiness array if exists
      const businessIndex = state.menusByBusiness.findIndex(m => m._id === action.payload.menu._id);
      if (businessIndex !== -1) {
        state.menusByBusiness[businessIndex] = action.payload.menu;
      }

      // Update in menusByTemplate array if exists
      const templateIndex = state.menusByTemplate.findIndex(m => m._id === action.payload.menu._id);
      if (templateIndex !== -1) {
        state.menusByTemplate[templateIndex] = action.payload.menu;
      }
    },

    // Update menu template
    updateMenuTemplateSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Menu template updated successfully';
      state.currentMenu = action.payload.menu;

      // Update in menus array if exists
      const index = state.menus.findIndex(m => m._id === action.payload.menu._id);
      if (index !== -1) {
        state.menus[index] = action.payload.menu;
      }

      // Update in menusByBusiness array if exists
      const businessIndex = state.menusByBusiness.findIndex(m => m._id === action.payload.menu._id);
      if (businessIndex !== -1) {
        state.menusByBusiness[businessIndex] = action.payload.menu;
      }

      // Update in menusByTemplate array if exists
      const templateIndex = state.menusByTemplate.findIndex(m => m._id === action.payload.menu._id);
      if (templateIndex !== -1) {
        state.menusByTemplate[templateIndex] = action.payload.menu;
      }
    },

    // Toggle menu active status
    toggleMenuActiveSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Menu active status toggled successfully';
      state.currentMenu = action.payload.menu;

      // Update in menus array if exists
      const index = state.menus.findIndex(m => m._id === action.payload.menu._id);
      if (index !== -1) {
        state.menus[index] = action.payload.menu;
      }

      // Update in menusByBusiness array if exists
      const businessIndex = state.menusByBusiness.findIndex(m => m._id === action.payload.menu._id);
      if (businessIndex !== -1) {
        state.menusByBusiness[businessIndex] = action.payload.menu;
      }

      // Update in menusByTemplate array if exists
      const templateIndex = state.menusByTemplate.findIndex(m => m._id === action.payload.menu._id);
      if (templateIndex !== -1) {
        state.menusByTemplate[templateIndex] = action.payload.menu;
      }
    },

    // Toggle menu publish status
    toggleMenuPublishSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Menu publish status toggled successfully';
      state.currentMenu = action.payload.menu;

      // Update in menus array if exists
      const index = state.menus.findIndex(m => m._id === action.payload.menu._id);
      if (index !== -1) {
        state.menus[index] = action.payload.menu;
      }

      // Update in menusByBusiness array if exists
      const businessIndex = state.menusByBusiness.findIndex(m => m._id === action.payload.menu._id);
      if (businessIndex !== -1) {
        state.menusByBusiness[businessIndex] = action.payload.menu;
      }

      // Update in menusByTemplate array if exists
      const templateIndex = state.menusByTemplate.findIndex(m => m._id === action.payload.menu._id);
      if (templateIndex !== -1) {
        state.menusByTemplate[templateIndex] = action.payload.menu;
      }
    },

    // Toggle menu social media visibility
    toggleMenuSocialMediaVisibleSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'Menu social media visibility toggled successfully';
      state.currentMenu = action.payload.menu;

      // Update in menus array if exists
      const index = state.menus.findIndex(m => m._id === action.payload.menu._id);
      if (index !== -1) {
        state.menus[index] = action.payload.menu;
      }

      // Update in menusByBusiness array if exists
      const businessIndex = state.menusByBusiness.findIndex(m => m._id === action.payload.menu._id);
      if (businessIndex !== -1) {
        state.menusByBusiness[businessIndex] = action.payload.menu;
      }

      // Update in menusByTemplate array if exists
      const templateIndex = state.menusByTemplate.findIndex(m => m._id === action.payload.menu._id);
      if (templateIndex !== -1) {
        state.menusByTemplate[templateIndex] = action.payload.menu;
      }
    },

    // Delete menu
    deleteMenuSuccess: (state, action) => {
      state.loading = false;
      state.menus = state.menus.filter(menu => menu._id !== action.payload);
      state.menusByBusiness = state.menusByBusiness.filter(menu => menu._id !== action.payload);
      state.menusByTemplate = state.menusByTemplate.filter(menu => menu._id !== action.payload);
      state.currentMenu = null;
      state.success = true;
      state.message = 'Menu deleted successfully';
    },

    // Request failure
    menuRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Clear state
    clearMenuState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },

    // Reset state to initial values
    resetMenuState: () => initialState
  }
});

export const {
  menuRequestStart,
  getMenusSuccess,
  getMenuSuccess,
  getMenusByBusinessSuccess,
  getMenusByTemplateSuccess,
  createMenuSuccess,
  updateMenuSuccess,
  updateMenuTemplateSuccess,
  toggleMenuActiveSuccess,
  toggleMenuPublishSuccess,
  toggleMenuSocialMediaVisibleSuccess,
  deleteMenuSuccess,
  menuRequestFailure,
  clearMenuState,
  resetMenuState
} = menuSlice.actions;

export default menuSlice.reducer;
