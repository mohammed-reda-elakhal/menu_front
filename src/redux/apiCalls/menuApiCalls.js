import {
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
  menuRequestFailure
} from '../Slice/menuSlice';
import request from '../../config/request';

// Get all menus
export function getAllMenus() {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.get('/menu');
      dispatch(getMenusSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching menus:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menus';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get menu by ID
export function getMenuById(menuId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.get(`/menu/${menuId}`);
      dispatch(getMenuSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menu';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get menu by code_menu
export function getMenuByCodeMenu(codeMenu) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.get(`/menu/code/${codeMenu}`);
      dispatch(getMenuSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching menu by code:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menu';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get menus by business
export function getMenusByBusiness(businessId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.get(`/menu/business/${businessId}`);
      dispatch(getMenusByBusinessSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching menus by business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menus';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get menus by template
export function getMenusByTemplate(templateId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.get(`/menu/template/${templateId}`);
      dispatch(getMenusByTemplateSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching menus by template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menus';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create menu
export function createMenu(menuData) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.post('/menu', menuData);
      dispatch(createMenuSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create menu';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update menu
export function updateMenu(menuId, menuData) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.put(`/menu/${menuId}`, menuData);
      dispatch(updateMenuSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update menu';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update menu template
export function updateMenuTemplate(menuId, templateId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.put(`/menu/${menuId}/template`, { template: templateId });
      dispatch(updateMenuTemplateSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating menu template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update menu template';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle menu active status
export function toggleMenuActive(menuId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.put(`/menu/${menuId}/active`);
      dispatch(toggleMenuActiveSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling menu active status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle menu active status';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle menu publish status
export function toggleMenuPublish(menuId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.put(`/menu/${menuId}/publier`);
      dispatch(toggleMenuPublishSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling menu publish status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle menu publish status';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle menu social media visibility
export function toggleMenuSocialMediaVisible(menuId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      const response = await request.put(`/menu/${menuId}/socialMediaVisible`);
      dispatch(toggleMenuSocialMediaVisibleSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling menu social media visibility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle menu social media visibility';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete menu
export function deleteMenu(menuId) {
  return async (dispatch) => {
    try {
      dispatch(menuRequestStart());
      await request.delete(`/menu/${menuId}`);
      dispatch(deleteMenuSuccess(menuId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete menu';
      dispatch(menuRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}
