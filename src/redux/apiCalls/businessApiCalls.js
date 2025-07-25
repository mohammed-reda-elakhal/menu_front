import {
  businessRequestStart,
  getBusinessesSuccess,
  getBusinessSuccess,
  getSimilarBusinessesSuccess,
  getBusinessTypesSuccess,
  createBusinessSuccess,
  updateBusinessSuccess,
  deleteBusinessSuccess,
  businessRequestFailure,
  setSelectedBusiness,
  rateBusinessSuccess,
  checkRatingStatusSuccess,
  ratingRequestStart
} from '../Slice/businessSlice';
import request from '../../config/request';

// Get all businesses with pagination
export function getAllBusinesses(params = {}) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());

      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      // Add sorting params
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      // Add filtering params
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.ville) queryParams.append('ville', params.ville);

      // Build URL with query params
      const url = `/business${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await request.get(url);
      dispatch(getBusinessesSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch businesses';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get business by ID
export function getBusinessById(businessId) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      const response = await request.get(`/business/${businessId}`);
      dispatch(getBusinessSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch business';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get similar businesses based on type
export function getSimilarBusinesses(businessId, limit = 4) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      const response = await request.get(`/business/similar/${businessId}?limit=${limit}`);
      dispatch(getSimilarBusinessesSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching similar businesses:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch similar businesses';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Check if a device has already rated a business
export function checkRatingStatus(businessId, deviceId) {
  return async (dispatch) => {
    try {
      dispatch(ratingRequestStart());
      const response = await request.get(`/business/rating-status/${businessId}?deviceId=${deviceId}`);
      dispatch(checkRatingStatusSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error checking rating status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to check rating status';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Rate a business
export function rateBusiness(businessId, rating, deviceId) {
  return async (dispatch) => {
    try {
      dispatch(ratingRequestStart());
      const response = await request.post(`/business/rate/${businessId}`, {
        rating, // 'positive' or 'negative'
        deviceId
      });
      dispatch(rateBusinessSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error rating business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to rate business';
      const alreadyRated = error.response?.data?.alreadyRated || false;
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage, alreadyRated };
    }
  };
}

// Get businesses by person
export function getBusinessesByPerson(personId) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      const response = await request.get(`/business/person/${personId}`);
      dispatch(getBusinessesSuccess(response.data));

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching businesses by person:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch businesses';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get businesses by type
export function getBusinessesByType(typeId) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      const response = await request.get(`/business/type/${typeId}`);
      dispatch(getBusinessesSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching businesses by type:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch businesses';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get business types
export function getBusinessTypes() {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      const response = await request.get('/business-types');
      dispatch(getBusinessTypesSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching business types:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch business types';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create business
export function createBusiness(businessData) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());

      // Handle file uploads if logo or coverImage are provided as File objects
      let formData;
      const hasLogo = businessData.logo instanceof File;
      const hasCoverImage = businessData.coverImage instanceof File;

      if (hasLogo || hasCoverImage) {
        formData = new FormData();

        // Add all other business data to formData (excluding file fields)
        Object.keys(businessData).forEach(key => {
          if (key !== 'logo' && key !== 'coverImage') {
            if (typeof businessData[key] === 'object') {
              formData.append(key, JSON.stringify(businessData[key]));
            } else {
              formData.append(key, businessData[key]);
            }
          }
        });

        // Add the logo file if provided
        if (hasLogo) {
          formData.append('logo', businessData.logo);
        }

        // Add the cover image file if provided
        if (hasCoverImage) {
          formData.append('coverImage', businessData.coverImage);
        }
      }

      // Make the API call with the appropriate data format
      const response = await request.post(
        '/business',
        formData || businessData,
        formData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );

      dispatch(createBusinessSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create business';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update business
export function updateBusiness(businessId, businessData) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      let formData;
      const hasLogo = businessData.logo instanceof File;
      const hasCoverImage = businessData.coverImage instanceof File;

      if (hasLogo || hasCoverImage) {
        formData = new FormData();
        Object.keys(businessData).forEach(key => {
          if (key !== 'logo' && key !== 'coverImage') {
            if (typeof businessData[key] === 'object') {
              // Ensure proper serialization of nested objects
              formData.append(key, JSON.stringify(businessData[key]));
            } else {
              formData.append(key, businessData[key]);
            }
          }
        });

        // Add the logo file if provided
        if (hasLogo) {
          formData.append('logo', businessData.logo);
        }

        // Add the cover image file if provided
        if (hasCoverImage) {
          formData.append('coverImage', businessData.coverImage);
        }
      } else {
        // If not using FormData, ensure operatingHours and tags are properly formatted
        const updatedData = { ...businessData };

        // Ensure operatingHours is properly structured
        if (updatedData.operatingHours) {
          // Make sure all days have the required fields
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          days.forEach(day => {
            if (!updatedData.operatingHours[day]) {
              updatedData.operatingHours[day] = { open: "", close: "", closed: false };
            } else {
              // Ensure each day has all required fields
              updatedData.operatingHours[day] = {
                open: updatedData.operatingHours[day].open || "",
                close: updatedData.operatingHours[day].close || "",
                closed: updatedData.operatingHours[day].closed || false
              };
            }
          });
        }

        // Ensure tags is an array
        if (!Array.isArray(updatedData.tags)) {
          updatedData.tags = [];
        }

        businessData = updatedData;
      }

      const response = await request.put(
        `/business/${businessId}`,
        formData || businessData,
        formData ? {
          headers: { 'Content-Type': 'multipart/form-data' }
        } : {}
      );

      // Update the selected business in localStorage if it's the same business
      try {
        const storedBusinessString = localStorage.getItem('selectedBusiness');
        if (storedBusinessString) {
          const storedBusiness = JSON.parse(storedBusinessString);
          if (storedBusiness._id === businessId) {
            localStorage.setItem('selectedBusiness', JSON.stringify(response.data));
          }
        }
      } catch (e) {
        // Silent error handling for localStorage
      }

      dispatch(updateBusinessSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update business';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete business
export function deleteBusiness(businessId) {
  return async (dispatch) => {
    try {
      dispatch(businessRequestStart());
      await request.delete(`/business/${businessId}`);
      dispatch(deleteBusinessSuccess(businessId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting business:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete business';
      dispatch(businessRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Select business and save to both Redux state and localStorage
export function selectBusiness(business) {
  return (dispatch) => {
    try {
      // Save to localStorage
      try {
        localStorage.setItem('selectedBusiness', JSON.stringify(business));
      } catch (e) {
        // Silent error handling
      }

      // Update Redux state
      dispatch(setSelectedBusiness(business));

      return { success: true, data: business };
    } catch (error) {
      console.error('Error selecting business:', error);
      return { success: false, error: 'Failed to select business' };
    }
  };
}

// Clear selected business from Redux state and localStorage
export function clearSelectedBusiness() {
  return (dispatch) => {
    try {
      // Remove from localStorage
      try {
        localStorage.removeItem('selectedBusiness');
      } catch (e) {
        // Silent error handling
      }

      // Update Redux state
      dispatch(setSelectedBusiness(null));

      return { success: true };
    } catch (error) {
      console.error('Error clearing selected business:', error);
      return { success: false, error: 'Failed to clear selected business' };
    }
  };
}
