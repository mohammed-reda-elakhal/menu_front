import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  persons: [],
  currentPerson: null,
  loading: false,
  error: null,
  success: false,
  message: ''
};

const personSlice = createSlice({
  name: "person",
  initialState,

  reducers: {
    // Request actions
    personRequestStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    personRequestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Get all persons
    getPersonsSuccess(state, action) {
      state.loading = false;
      state.persons = action.payload;
      state.error = null;
    },

    // Get person by ID
    getPersonSuccess(state, action) {
      state.loading = false;
      state.currentPerson = action.payload;
      state.error = null;
    },

    // Update person
    updatePersonSuccess(state, action) {
      state.loading = false;
      state.currentPerson = action.payload;
      state.success = true;
      state.message = 'Person updated successfully';

      // Update the person in the persons array if it exists
      const index = state.persons.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.persons[index] = action.payload;
      }
    },

    // Delete person
    deletePersonSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = 'Person deleted successfully';

      // Remove the person from the persons array
      state.persons = state.persons.filter(p => p._id !== action.payload);
    },

    // Toggle active status
    toggleActiveSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = 'Active status toggled successfully';

      // Update the active status in the current person
      if (state.currentPerson && state.currentPerson._id === action.payload.id) {
        state.currentPerson.active = action.payload.active;
      }

      // Update the active status in the persons array
      const index = state.persons.findIndex(p => p._id === action.payload.id);
      if (index !== -1) {
        state.persons[index].active = action.payload.active;
      }
    },

    // Toggle verify status
    toggleVerifySuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = 'Verify status toggled successfully';

      // Update the verify status in the current person
      if (state.currentPerson && state.currentPerson._id === action.payload.id) {
        state.currentPerson.verify = action.payload.verify;
      }

      // Update the verify status in the persons array
      const index = state.persons.findIndex(p => p._id === action.payload.id);
      if (index !== -1) {
        state.persons[index].verify = action.payload.verify;
      }
    },

    // Update password
    updatePasswordSuccess(state) {
      state.loading = false;
      state.success = true;
      state.message = 'Password updated successfully';
    },

    // Upload profile photo
    profilePhotoUploadSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = 'Profile photo uploaded successfully';

      // Update the profile in the current person
      if (state.currentPerson) {
        state.currentPerson.profile = action.payload.profile;
      }

      // Update the profile in the persons array
      const index = state.persons.findIndex(p => p._id === action.payload.id);
      if (index !== -1) {
        state.persons[index].profile = action.payload.profile;
      }
    },

    // Clear state
    clearPersonState(state) {
      state.success = false;
      state.error = null;
      state.message = '';
    },

    // Reset state to initial values
    resetPersonState: () => initialState
  }
});

export const {
  personRequestStart,
  personRequestFailure,
  getPersonsSuccess,
  getPersonSuccess,
  updatePersonSuccess,
  deletePersonSuccess,
  toggleActiveSuccess,
  toggleVerifySuccess,
  updatePasswordSuccess,
  profilePhotoUploadSuccess,
  clearPersonState,
  resetPersonState
} = personSlice.actions;

export default personSlice.reducer;
