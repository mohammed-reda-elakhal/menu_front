import {
  supplementaireRequestStart,
  getSupplementairesSuccess,
  getSupplementaireSuccess,
  getSupplementairesByCategorieSuccess,
  createSupplementaireSuccess,
  updateSupplementaireSuccess,
  toggleSupplementaireVisibleSuccess,
  deleteSupplementaireSuccess,
  supplementaireRequestFailure,
  getSupplementairesByMenuSuccess
} from '../Slice/supplementaireSlice';
import request from '../../config/request';

// Get all supplementary items
export function getAllSupplementaires() {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      const response = await request.get('/supplementaire');
      dispatch(getSupplementairesSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching supplementary items:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch supplementary items';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get supplementary item by ID
export function getSupplementaireById(supplementaireId) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      const response = await request.get(`/supplementaire/${supplementaireId}`);
      dispatch(getSupplementaireSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching supplementary item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch supplementary item';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get supplementary items by category
export function getSupplementairesByCategorie(categorieId) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      const response = await request.get(`/supplementaire/categorie/${categorieId}`);
      dispatch(getSupplementairesByCategorieSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching supplementary items by category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch supplementary items';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get supplementary items by menu
export function getSupplementairesByMenu(menuId) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      const response = await request.get(`/supplementaire/menu/${menuId}`);
      dispatch(getSupplementairesByMenuSuccess(response.data.supplementaires));
      return { success: true, data: response.data.supplementaires };
    } catch (error) {
      console.error('Error fetching supplementary items by menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch supplementary items';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create supplementary item
export function createSupplementaire(supplementaireData) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());

      // Check if supplementaireData is already a FormData object
      const isFormData = supplementaireData instanceof FormData;

      // Make the API call with the appropriate data format and headers
      const response = await request.post(
        '/supplementaire',
        supplementaireData,
        isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );

      dispatch(createSupplementaireSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating supplementary item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create supplementary item';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update supplementary item
export function updateSupplementaire(supplementaireId, supplementaireData) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());

      // Check if supplementaireData is already a FormData object
      const isFormData = supplementaireData instanceof FormData;

      // Make the API call with the appropriate data format and headers
      const response = await request.put(
        `/supplementaire/${supplementaireId}`,
        supplementaireData,
        isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );

      dispatch(updateSupplementaireSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating supplementary item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update supplementary item';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle supplementary item visibility
export function toggleSupplementaireVisible(supplementaireId) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      const response = await request.put(`/supplementaire/${supplementaireId}/visible`);
      dispatch(toggleSupplementaireVisibleSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling supplementary item visibility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle supplementary item visibility';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete supplementary item
export function deleteSupplementaire(supplementaireId) {
  return async (dispatch) => {
    try {
      dispatch(supplementaireRequestStart());
      await request.delete(`/supplementaire/${supplementaireId}`);
      dispatch(deleteSupplementaireSuccess(supplementaireId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting supplementary item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete supplementary item';
      dispatch(supplementaireRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}
