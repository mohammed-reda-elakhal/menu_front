import {
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
  bulkDeleteProduitsStart,
  bulkDeleteProduitsSuccess,
  bulkDeleteProduitsFailure
} from '../Slice/produitSlice';
import request from '../../config/request';

// Get all products
export function getAllProduits() {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get('/produit');
      dispatch(getProduitsSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get product by ID
export function getProduitById(produitId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get(`/produit/${produitId}`);
      dispatch(getProduitSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get products by category
export function getProduitsByCategorie(categorieId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get(`/produit/categorie/${categorieId}`);
      dispatch(getProduitsByCategorieSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get products by menu ID
export function getProduitsByMenu(menuId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get(`/produit/menu/${menuId}`);
      dispatch(getProduitsByMenuSuccess(response.data.produits));
      return { success: true, data: response.data.produits };
    } catch (error) {
      console.error('Error fetching products by menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch menu products';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create product
export function createProduit(produitData) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());

      // Log the incoming data for debugging
      console.log('Creating product with data:', produitData);

      // Always use FormData for consistency
      const formData = new FormData();

      // Add basic text fields
      formData.append('nom', produitData.nom || produitData.name || '');
      formData.append('description', produitData.description || '');
      formData.append('prix', produitData.prix || produitData.price || 0);

      // Handle promo_prix (optional)
      if (produitData.promo_prix || produitData.promoPrice) {
        formData.append('promo_prix', produitData.promo_prix || produitData.promoPrice);
      }

      // Add category ID
      formData.append('categorie', produitData.categorie || produitData.categoryId || '');

      // Handle visibility
      formData.append('visible', produitData.visible === undefined ? true : produitData.visible);

      // Handle new attributes
      formData.append('isVegetarian', produitData.isVegetarian === undefined ? false : produitData.isVegetarian);
      formData.append('isSpicy', produitData.isSpicy === undefined ? false : produitData.isSpicy);
      formData.append('isHalal', produitData.isHalal === undefined ? false : produitData.isHalal);
      formData.append('isBest', produitData.isBest === undefined ? false : produitData.isBest);

      // Handle calories if present and valid
      if (
        produitData.calories !== undefined &&
        produitData.calories !== null &&
        produitData.calories !== '' &&
        produitData.calories !== 'null' &&
        !isNaN(produitData.calories)
      ) {
        formData.append('calories', produitData.calories);
      }

      // Handle tags array
      if (Array.isArray(produitData.tags)) {
        produitData.tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }

      // Handle components array

      // Process components based on what we received
      if (Array.isArray(produitData.composant)) {
        // Backend expects array
        produitData.composant.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (Array.isArray(produitData.components)) {
        // Backend expects array
        produitData.components.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (typeof produitData.composant === 'string') {
        // Split string into array
        const comps = produitData.composant.split(',').map(c => c.trim()).filter(Boolean);
        comps.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (typeof produitData.components === 'string') {
        // Split string into array
        const comps = produitData.components.split(',').map(c => c.trim()).filter(Boolean);
        comps.forEach(comp => {
          formData.append('composant', comp);
        });
      }

      // Add image if it exists
      if (produitData.image instanceof File) {
        formData.append('image', produitData.image);
      } else {
        // If no image is provided, create a simple placeholder image
        // This ensures the API requirement for an image is satisfied
        const placeholderBlob = new Blob(['placeholder'], { type: 'image/png' });
        const placeholderFile = new File([placeholderBlob], 'placeholder.png', { type: 'image/png' });
        formData.append('image', placeholderFile);
        console.log('Using placeholder image for product');
      }

      // Log FormData entries for debugging
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Make the API call with FormData
      const response = await request.post(
        '/produit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('API response:', response.data);

      dispatch(createProduitSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update product
export function updateProduit(produitId, produitData) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());

      console.log('Updating product with data:', produitData);

      // Always use FormData for consistency
      const formData = new FormData();

      // Add basic text fields
      if (produitData.nom || produitData.name) {
        formData.append('nom', produitData.nom || produitData.name);
      }

      if (produitData.description !== undefined) {
        formData.append('description', produitData.description);
      }

      if (produitData.prix !== undefined || produitData.price !== undefined) {
        formData.append('prix', produitData.prix || produitData.price);
      }

      // Handle promo_prix (optional)
      if (produitData.promo_prix || produitData.promoPrice) {
        formData.append('promo_prix', produitData.promo_prix || produitData.promoPrice);
      }

      // Add category ID if present
      if (produitData.categorie || produitData.categoryId) {
        formData.append('categorie', produitData.categorie || produitData.categoryId);
      }

      // Handle visibility if present
      if (produitData.visible !== undefined) {
        formData.append('visible', produitData.visible);
      }

      // Handle new attributes
      if (produitData.isVegetarian !== undefined) {
        formData.append('isVegetarian', produitData.isVegetarian);
      }

      if (produitData.isSpicy !== undefined) {
        formData.append('isSpicy', produitData.isSpicy);
      }

      if (produitData.isHalal !== undefined) {
        formData.append('isHalal', produitData.isHalal);
      }

      if (produitData.isBest !== undefined) {
        formData.append('isBest', produitData.isBest);
      }

      // Handle calories if present and valid
      if (
        produitData.calories !== undefined &&
        produitData.calories !== null &&
        produitData.calories !== '' &&
        produitData.calories !== 'null' &&
        !isNaN(produitData.calories)
      ) {
        formData.append('calories', produitData.calories);
      }

      // Handle tags array if present
      if (Array.isArray(produitData.tags)) {
        produitData.tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }

      // Handle components array
      // Process components based on what we received
      if (Array.isArray(produitData.composant)) {
        // Backend expects array
        produitData.composant.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (Array.isArray(produitData.components)) {
        // Backend expects array
        produitData.components.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (typeof produitData.composant === 'string') {
        // Split string into array
        const comps = produitData.composant.split(',').map(c => c.trim()).filter(Boolean);
        comps.forEach(comp => {
          formData.append('composant', comp);
        });
      } else if (typeof produitData.components === 'string') {
        // Split string into array
        const comps = produitData.components.split(',').map(c => c.trim()).filter(Boolean);
        comps.forEach(comp => {
          formData.append('composant', comp);
        });
      }

      // Add image if it exists and is a File object
      if (produitData.image instanceof File) {
        formData.append('image', produitData.image);
      }

      // Log FormData entries for debugging
      console.log('FormData entries for update:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Make the API call with FormData
      const response = await request.put(
        `/produit/${produitId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Update API response:', response.data);

      dispatch(updateProduitSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle product visibility
export function toggleProduitVisible(produitId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.put(`/produit/${produitId}/visible`);
      dispatch(toggleProduitVisibleSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle product visibility';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete product
export function deleteProduit(produitId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      await request.delete(`/produit/${produitId}`);
      dispatch(deleteProduitSuccess(produitId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Check if a device has already rated a product
export function checkProductRatingStatus(productId, deviceId) {
  return async (dispatch) => {
    try {
      dispatch(ratingRequestStart());
      const response = await request.get(`/produit/${productId}/rating-status?deviceId=${deviceId}`);

      dispatch(checkRatingStatusSuccess(response.data));
      return {
        success: true,
        hasRated: response.data.hasRated,
        ratings: response.data.ratings
      };
    } catch (error) {
      console.error('Error checking product rating status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to check product rating status';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Rate a product
export function rateProduct(productId, rating, deviceId) {
  return async (dispatch) => {
    try {
      dispatch(ratingRequestStart());

      const response = await request.post(`/produit/${productId}/rate`, {
        rating, // 'positive' or 'negative'
        deviceId
      });

      dispatch(rateProduitSuccess(response.data));
      return {
        success: true,
        message: response.data.message,
        ratings: response.data.ratings
      };
    } catch (error) {
      console.error('Error rating product:', error);

      // Check if the error is because the user has already rated
      if (error.response?.data?.alreadyRated) {
        return {
          success: false,
          alreadyRated: true,
          error: error.response.data.message || 'You have already rated this product'
        };
      }

      const errorMessage = error.response?.data?.message || 'Failed to rate product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get best products by menu ID
export function getBestProductsByMenu(menuId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get(`/produit/best/menu/${menuId}`);
      dispatch(getBestProductsSuccess(response.data.produits));
      return { success: true, data: response.data.produits };
    } catch (error) {
      console.error('Error fetching best products by menu:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch best products';
      dispatch(getBestProductsFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get best products by business ID
export function getBestProductsByBusiness(businessId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.get(`/produit/best/business/${businessId}`);
      dispatch(getBestProductsSuccess(response.data.produits));
      return { success: true, data: response.data.produits };
    } catch (error) {
      console.error('Error fetching best products by business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch best products';
      dispatch(getBestProductsFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle product isBest status
export function toggleProductIsBest(productId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      const response = await request.put(`/produit/${productId}/is-best`);
      dispatch(toggleIsBestSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error toggling product isBest status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle isBest status';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Bulk delete products
export function bulkDeleteProduits(ids) {
  return async (dispatch) => {
    try {
      dispatch(bulkDeleteProduitsStart());
      const response = await request.delete(
        '/produit/bulk-delete',
        {
          data: { ids },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch(bulkDeleteProduitsSuccess(ids));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      const errorMessage = error.response?.data?.message || 'Failed to bulk delete products';
      dispatch(bulkDeleteProduitsFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}
