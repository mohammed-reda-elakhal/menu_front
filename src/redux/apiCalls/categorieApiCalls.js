import {
  categorieRequestStart,
  getCategoriesSuccess,
  getCategorieSuccess,
  getCategoriesByMenuSuccess,
  createCategorieSuccess,
  updateCategorieSuccess,
  deleteCategorieSuccess,
  categorieRequestFailure
} from '../Slice/categorieSlice';
import request from '../../config/request';

// Get all categories
export function getAllCategories() {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());
      const response = await request.get('/categorie');
      dispatch(getCategoriesSuccess(response.data));
      return { success: true, data: response.data.categories };
    } catch (error) {
      console.error('Error fetching categories:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get category by ID
export function getCategorieById(categorieId) {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());
      const response = await request.get(`/categorie/${categorieId}`);
      dispatch(getCategorieSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch category';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get categories by menu
export function getCategoriesByMenu(menuId) {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());
      const response = await request.get(`/categorie/menu/${menuId}`);
      dispatch(getCategoriesByMenuSuccess(response.data));
      return { success: true, data: response.data.categories };
    } catch (error) {
      console.error('Error fetching categories by menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create category
export function createCategorie(categorieData) {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());

      // Check if categorieData is already a FormData object
      let formData;
      if (categorieData instanceof FormData) {
        console.log('Using provided FormData object');
        formData = categorieData;
      } else if (categorieData.image instanceof File) {
        console.log('Creating new FormData with image file');
        formData = new FormData();

        // Add all other category data to formData
        Object.keys(categorieData).forEach(key => {
          if (key !== 'image') {
            if (typeof categorieData[key] === 'object') {
              formData.append(key, JSON.stringify(categorieData[key]));
            } else {
              formData.append(key, categorieData[key]);
            }
          }
        });

        // Add the image file
        formData.append('image', categorieData.image);
      } else {
        console.log('No image file found, using regular data object');
      }

      // Log the request details for debugging
      console.log('API Request URL:', '/categorie');
      console.log('API Request Type:', formData ? 'multipart/form-data' : 'application/json');

      // Make the API call with the appropriate data format
      const response = await request.post(
        '/categorie',
        formData || categorieData,
        formData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );

      console.log('API Response:', response.data);
      dispatch(createCategorieSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update category
export function updateCategorie(categorieId, categorieData) {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());

      // Handle file upload if image is provided as a File object
      let formData;
      if (categorieData.image instanceof File) {
        formData = new FormData();

        // Add all other category data to formData
        Object.keys(categorieData).forEach(key => {
          if (key !== 'image') {
            if (typeof categorieData[key] === 'object') {
              formData.append(key, JSON.stringify(categorieData[key]));
            } else {
              formData.append(key, categorieData[key]);
            }
          }
        });

        // Add the image file
        formData.append('image', categorieData.image);
      }

      // Make the API call with the appropriate data format
      const response = await request.put(
        `/categorie/${categorieId}`,
        formData || categorieData,
        formData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );

      dispatch(updateCategorieSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete category
export function deleteCategorie(categorieId) {
  return async (dispatch) => {
    try {
      dispatch(categorieRequestStart());
      await request.delete(`/categorie/${categorieId}`);
      dispatch(deleteCategorieSuccess(categorieId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      dispatch(categorieRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}
