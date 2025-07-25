import {
  templateRequestStart,
  getTemplatesSuccess,
  getTemplateSuccess,
  createTemplateSuccess,
  updateTemplateSuccess,
  deleteTemplateSuccess,
  toggleTemplatePublishedSuccess,
  templateRequestFailure,
  clearTemplateState
} from '../Slice/templateSlice';
import request from '../../config/request';

// Get all templates
export function getAllTemplates(page = 1, isPublished = null) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      
      let url = `/template?page=${page}&limit=50`;
      if (isPublished !== null) {
        url += `&isPublished=${isPublished}`;
      }
      
      const response = await request.get(url);
      dispatch(getTemplatesSuccess(response.data));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching templates:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch templates';
      dispatch(templateRequestFailure(errorMessage));
      
      return { success: false, error: errorMessage };
    }
  };
}

// Get only published templates
export function getPublishedTemplates(page = 1) {
  return getAllTemplates(page, true);
}

// Get template by ID
export function getTemplateById(templateId) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      const response = await request.get(`/template/${templateId}`);
      dispatch(getTemplateSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch template';
      dispatch(templateRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Create template
export function createTemplate(templateData) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      const response = await request.post(
        '/template',
        templateData,
        templateData instanceof FormData ? {
          headers: { 'Content-Type': 'multipart/form-data' }
        } : {}
      );
      
      dispatch(createTemplateSuccess(response.data));
      dispatch(resetTemplateState()); // Clear loading state immediately
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create template';
      dispatch(templateRequestFailure(errorMessage));
      dispatch(resetTemplateState()); // Clear loading state immediately
      return { success: false, error: errorMessage };
    }
  };
}

// Update template
export function updateTemplate(templateId, templateData) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      const response = await request.put(
        `/template/${templateId}`,
        templateData,
        templateData instanceof FormData ? {
          headers: { 'Content-Type': 'multipart/form-data' }
        } : {}
      );
      
      dispatch(updateTemplateSuccess(response.data));
      dispatch(resetTemplateState()); // Clear loading state immediately
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update template';
      dispatch(templateRequestFailure(errorMessage));
      dispatch(resetTemplateState()); // Clear loading state immediately
      return { success: false, error: errorMessage };
    }
  };
}

// Delete template
export function deleteTemplate(templateId) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      await request.delete(`/template/${templateId}`);
      dispatch(deleteTemplateSuccess(templateId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete template';
      dispatch(templateRequestFailure(errorMessage));
      // Clear the loading state after a short delay to ensure the error message is displayed
      setTimeout(() => {
        dispatch(resetTemplateState());
      }, 3000);
      return { success: false, error: errorMessage };
    }
  };
}

// Reset template state
export function resetTemplateState() {
  return (dispatch) => {
    dispatch(clearTemplateState());
  };
}

// Toggle template published status
export function toggleTemplatePublished(templateId, isPublished) {
  return async (dispatch) => {
    try {
      dispatch(templateRequestStart());
      const response = await request.patch(`/template/${templateId}/publish`, { isPublished });
      dispatch(toggleTemplatePublishedSuccess({ id: templateId, isPublished: response.data.isPublished }));
      return { success: true, isPublished: response.data.isPublished };
    } catch (error) {
      console.error('Error toggling template published status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update template status';
      dispatch(templateRequestFailure(errorMessage));
      // Clear the loading state after a short delay to ensure the error message is displayed
      setTimeout(() => {
        dispatch(resetTemplateState());
      }, 3000);
      return { success: false, error: errorMessage };
    }
  };
}
