import {
  produitRequestStart,
  getProduitsByMenuSuccess,
  produitRequestFailure,
  createProduitSuccess,
  updateProduitSuccess,
  deleteProduitSuccess,
  toggleProduitVisibleSuccess,
  toggleIsBestSuccess
} from '../Slice/produitSlice';
import request from '../../config/request';

// Simple in-memory cache for products
class ProductCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
}

const productCache = new ProductCache();

// Enhanced get products by menu with pagination
export function getProduitsByMenuPaginated(menuId, options = {}) {
  return async (dispatch) => {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        category = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        useCache = true
      } = options;

      // Create cache key
      const cacheKey = `menu_${menuId}_page_${page}_limit_${limit}_search_${search}_category_${category}_sort_${sortBy}_${sortOrder}`;
      
      // Check cache first
      if (useCache) {
        const cachedData = productCache.get(cacheKey);
        if (cachedData) {
          dispatch(getProduitsByMenuSuccess(cachedData));
          return { success: true, data: cachedData, fromCache: true };
        }
      }

      dispatch(produitRequestStart());

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const response = await request.get(`/produit/menu/${menuId}/paginated?${params}`);
      
      const responseData = {
        produits: response.data.produits || [],
        pagination: {
          currentPage: response.data.currentPage || page,
          totalPages: response.data.totalPages || 1,
          totalItems: response.data.totalItems || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };

      // Cache the response
      if (useCache) {
        productCache.set(cacheKey, responseData);
      }

      dispatch(getProduitsByMenuSuccess(responseData));
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Search products with debouncing support
export function searchProducts(searchTerm, options = {}) {
  return async (dispatch) => {
    try {
      const {
        menuId,
        page = 1,
        limit = 20,
        category = '',
        filters = {}
      } = options;

      // Don't search for very short terms
      if (searchTerm.length < 2) {
        return { success: true, data: { produits: [], pagination: {} } };
      }

      const cacheKey = `search_${searchTerm}_menu_${menuId}_page_${page}_category_${category}`;
      const cachedData = productCache.get(cacheKey);
      
      if (cachedData) {
        return { success: true, data: cachedData, fromCache: true };
      }

      dispatch(produitRequestStart());

      const params = new URLSearchParams({
        q: searchTerm,
        page: page.toString(),
        limit: limit.toString()
      });

      if (menuId) params.append('menuId', menuId);
      if (category) params.append('category', category);
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await request.get(`/produit/search?${params}`);
      
      const responseData = {
        produits: response.data.produits || [],
        pagination: response.data.pagination || {},
        searchTerm,
        totalResults: response.data.totalResults || 0
      };

      productCache.set(cacheKey, responseData);
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error searching products:', error);
      const errorMessage = error.response?.data?.message || 'Search failed';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Prefetch next page
export function prefetchNextPage(menuId, currentPage, options = {}) {
  return async (dispatch) => {
    try {
      const nextPage = currentPage + 1;
      const prefetchOptions = {
        ...options,
        page: nextPage,
        useCache: true
      };

      // Prefetch in background without updating UI
      await dispatch(getProduitsByMenuPaginated(menuId, prefetchOptions));
    } catch (error) {
      // Silently fail for prefetch
      console.warn('Prefetch failed:', error);
    }
  };
}

// Enhanced create product with optimistic updates
export function createProduitOptimistic(produitData, optimisticId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());

      // Create FormData as before
      const formData = new FormData();
      
      // Add all fields (keeping existing logic)
      formData.append('nom', produitData.nom || produitData.name || '');
      formData.append('description', produitData.description || '');
      formData.append('prix', produitData.prix || produitData.price || 0);

      if (produitData.promo_prix || produitData.promoPrice) {
        formData.append('promo_prix', produitData.promo_prix || produitData.promoPrice);
      }

      formData.append('categorie', produitData.categorie || produitData.categoryId || '');
      formData.append('visible', produitData.visible === undefined ? true : produitData.visible);
      formData.append('isVegetarian', produitData.isVegetarian === undefined ? false : produitData.isVegetarian);
      formData.append('isSpicy', produitData.isSpicy === undefined ? false : produitData.isSpicy);
      formData.append('isHalal', produitData.isHalal === undefined ? false : produitData.isHalal);
      formData.append('isBest', produitData.isBest === undefined ? false : produitData.isBest);

      if (produitData.calories) {
        formData.append('calories', produitData.calories);
      }

      // Handle tags and components
      if (Array.isArray(produitData.tags)) {
        produitData.tags.forEach(tag => formData.append('tags', tag));
      }

      if (Array.isArray(produitData.composant)) {
        produitData.composant.forEach(comp => formData.append('composant', comp));
      } else if (Array.isArray(produitData.components)) {
        produitData.components.forEach(comp => formData.append('composant', comp));
      }

      // Handle image
      if (produitData.image instanceof File) {
        formData.append('image', produitData.image);
      }

      const response = await request.post('/produit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Invalidate cache for this menu
      if (produitData.menuId) {
        productCache.invalidate(`menu_${produitData.menuId}`);
      }

      dispatch(createProduitSuccess(response.data));
      return { success: true, data: response.data, optimisticId };
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage, optimisticId };
    }
  };
}

// Enhanced update product with optimistic updates
export function updateProduitOptimistic(produitId, produitData, optimisticId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());

      const formData = new FormData();

      // Add fields that are being updated
      if (produitData.nom || produitData.name) {
        formData.append('nom', produitData.nom || produitData.name);
      }
      if (produitData.description !== undefined) {
        formData.append('description', produitData.description);
      }
      if (produitData.prix !== undefined || produitData.price !== undefined) {
        formData.append('prix', produitData.prix || produitData.price);
      }
      if (produitData.promo_prix !== undefined || produitData.promoPrice !== undefined) {
        formData.append('promo_prix', produitData.promo_prix || produitData.promoPrice);
      }
      if (produitData.categorie || produitData.categoryId) {
        formData.append('categorie', produitData.categorie || produitData.categoryId);
      }
      if (produitData.visible !== undefined) {
        formData.append('visible', produitData.visible);
      }
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
      if (produitData.calories !== undefined) {
        formData.append('calories', produitData.calories);
      }

      // Handle arrays
      if (Array.isArray(produitData.tags)) {
        produitData.tags.forEach(tag => formData.append('tags', tag));
      }
      if (Array.isArray(produitData.composant)) {
        produitData.composant.forEach(comp => formData.append('composant', comp));
      } else if (Array.isArray(produitData.components)) {
        produitData.components.forEach(comp => formData.append('composant', comp));
      }

      // Handle image
      if (produitData.image instanceof File) {
        formData.append('image', produitData.image);
      }

      const response = await request.put(`/produit/${produitId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Invalidate relevant cache entries
      productCache.invalidate('menu_');
      productCache.invalidate('search_');

      dispatch(updateProduitSuccess(response.data));
      return { success: true, data: response.data, optimisticId };
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage, optimisticId };
    }
  };
}

// Enhanced delete product with optimistic updates
export function deleteProduitOptimistic(produitId, optimisticId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      
      const response = await request.delete(`/produit/${produitId}`);

      // Invalidate cache
      productCache.invalidate('menu_');
      productCache.invalidate('search_');

      dispatch(deleteProduitSuccess(produitId));
      return { success: true, data: { deletedId: produitId }, optimisticId };
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage, optimisticId };
    }
  };
}

// Enhanced toggle visibility with optimistic updates
export function toggleProduitVisibleOptimistic(produitId, optimisticId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      
      const response = await request.patch(`/produit/${produitId}/toggle-visibility`);

      // Invalidate cache
      productCache.invalidate('menu_');

      dispatch(toggleProduitVisibleSuccess(response.data));
      return { success: true, data: response.data, optimisticId };
    } catch (error) {
      console.error('Error toggling visibility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle visibility';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage, optimisticId };
    }
  };
}

// Enhanced toggle best status with optimistic updates
export function toggleProductIsBestOptimistic(produitId, optimisticId) {
  return async (dispatch) => {
    try {
      dispatch(produitRequestStart());
      
      const response = await request.patch(`/produit/${produitId}/toggle-best`);

      // Invalidate cache
      productCache.invalidate('menu_');

      dispatch(toggleIsBestSuccess(response.data));
      return { success: true, data: response.data, optimisticId };
    } catch (error) {
      console.error('Error toggling best status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle best status';
      dispatch(produitRequestFailure(errorMessage));
      return { success: false, error: errorMessage, optimisticId };
    }
  };
}

// Utility to clear cache
export function clearProductCache() {
  productCache.clear();
}

// Utility to invalidate specific cache entries
export function invalidateProductCache(pattern) {
  productCache.invalidate(pattern);
}

export { productCache };
