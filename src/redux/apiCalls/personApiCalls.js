import request from '../../config/request';
import {
  personRequestStart,
  personRequestFailure,
  getPersonsSuccess,
  getPersonSuccess,
  updatePersonSuccess,
  deletePersonSuccess,
  toggleActiveSuccess,
  toggleVerifySuccess,
  updatePasswordSuccess,
  profilePhotoUploadSuccess
} from '../Slice/personSlice';

// Get all persons
export function getAllPersons() {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      const response = await request.get('/person');
      dispatch(getPersonsSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to fetch persons';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Get person by ID
export function getPersonById(personId) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      const response = await request.get(`/person/${personId}`);
      dispatch(getPersonSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to fetch person';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update person
export function updatePerson(personId, personData) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      const response = await request.put(`/person/${personId}`, personData);
      dispatch(updatePersonSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to update person';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Delete person
export function deletePerson(personId) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      await request.delete(`/person/${personId}`);
      dispatch(deletePersonSuccess(personId));
      return { success: true };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to delete person';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle active status
export function toggleActive(personId) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      const response = await request.patch(`/person/${personId}/active`);
      dispatch(toggleActiveSuccess({ id: personId, active: response.data.active }));
      return { success: true, active: response.data.active };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to toggle active status';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Toggle verify status
export function toggleVerify(personId) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      const response = await request.patch(`/person/${personId}/verify`);
      dispatch(toggleVerifySuccess({ id: personId, verify: response.data.verify }));
      return { success: true, verify: response.data.verify };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to toggle verify status';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Update password
export function updatePassword(personId, password) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());
      await request.patch(`/person/${personId}/password`, { password });
      dispatch(updatePasswordSuccess());
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}

// Upload profile photo
export function uploadProfilePhoto(personId, formData) {
  return async (dispatch) => {
    try {
      dispatch(personRequestStart());

      // Set the correct headers for file upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      // Use the formData directly - it already contains the file with the correct field name

      const response = await request.post(`/person/${personId}/profile`, formData, config);

      dispatch(profilePhotoUploadSuccess({ id: personId, profile: response.data.profile }));
      return { success: true, profile: response.data.profile };
    } catch (error) {

      const errorMessage = error.response?.data?.message || 'Failed to upload profile photo';
      dispatch(personRequestFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
}
