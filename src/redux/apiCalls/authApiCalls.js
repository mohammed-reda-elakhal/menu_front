import { loginStart, login, loginFailure, logout, resetAuthState } from "../Slice/authSlice";
import { resetBusinessState } from '../Slice/businessSlice';
import { resetPersonState } from '../Slice/personSlice';
import { resetMenuState } from '../Slice/menuSlice';
import { resetCategorieState } from '../Slice/categorieSlice';
import { resetProduitState } from '../Slice/produitSlice';
import { resetSupplementaireState } from '../Slice/supplementaireSlice';
import { resetTemplateState } from '../Slice/templateSlice';
import request from '../../config/request';

// login function
export function loginUser(userData) {
    return async (dispatch) => {
        try {
            dispatch(loginStart());

            const response = await request.post(`/auth/login`, {
                email: userData.email,
                password: userData.password
            });

            const data = response.data;

            // Check if the response has the expected format
            if (data && data.user) {
                dispatch(login(data.user));
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token || '');

                // Return success with user data including role
                return {
                    success: true,
                    user: data.user,
                    role: data.user.role || 'client' // Default to client if role is not specified
                };
            } else {
                console.error('Unexpected response format:', data);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message || "Login failed";
            dispatch(loginFailure(errorMessage));
            return { success: false, error: errorMessage };
        }
    };
}

// Register a new user
export function registerUser(userData) {
    return async (dispatch) => {
        try {
            dispatch(loginStart());
            console.log('Registering user with data:', userData);

            // Keep the userData as is - the backend expects profile to be an object
            const formattedUserData = { ...userData };

            // Make sure profile is an object if it's provided
            // The backend expects profile to be an object with url and publicId properties
            if (formattedUserData.profile) {
                if (typeof formattedUserData.profile === 'string') {
                    // If profile is a string, assume it's a URL
                    formattedUserData.profile = {
                        url: formattedUserData.profile,
                        publicId: 'default_profile'
                    };
                } else if (typeof formattedUserData.profile === 'object') {
                    // If profile is an object, ensure it has the correct properties
                    const validProfile = {};

                    // Only include properties that are allowed by the validation schema
                    if (formattedUserData.profile.url) {
                        validProfile.url = formattedUserData.profile.url;
                    } else {
                        validProfile.url = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
                    }

                    if (formattedUserData.profile.publicId) {
                        validProfile.publicId = formattedUserData.profile.publicId;
                    } else {
                        validProfile.publicId = 'default_profile';
                    }

                    // Replace the profile with the valid one
                    formattedUserData.profile = validProfile;
                }
            }

            console.log('Formatted user data:', formattedUserData);

            const response = await request.post(`/auth/register`, formattedUserData);
            console.log('Registration response:', response);

            const data = response.data;

            if (data && data.data) {
                // The backend returns user data in a nested 'data' property
                const user = data.data;
                const token = data.token;

                // Auto-login the user by storing their data in Redux and localStorage
                if (token) {
                    // Store the token and user data
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    // Update Redux state
                    dispatch(login(user));

                    // Return success with auto-login flag
                    return {
                        success: true,
                        user: user,
                        role: user.role || 'client',
                        message: data.message || 'Registration successful',
                        autoLogin: true,
                        token: token
                    };
                } else {
                    // If no token is provided, return success without auto-login
                    return {
                        success: true,
                        user: user,
                        role: user.role || 'client',
                        message: data.message || 'Registration successful',
                        autoLogin: false
                    };
                }
            } else {
                console.error('Unexpected response format:', data);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message || "Registration failed";
            dispatch(loginFailure(errorMessage));
            return { success: false, error: errorMessage };
        }
    };
}



export const logoutUser = () => {
    return (dispatch) => {
        // First dispatch the logout action for backward compatibility
        dispatch(logout());

        // Reset all states to their initial values
        dispatch(resetAuthState());
        dispatch(resetBusinessState());
        dispatch(resetPersonState());
        dispatch(resetMenuState());
        dispatch(resetCategorieState());
        dispatch(resetProduitState());
        dispatch(resetSupplementaireState());
        dispatch(resetTemplateState());

        // Clear all user-related data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('selectedBusiness');

        // Clear any other application-specific localStorage items if needed
        // For example, language preferences might be kept
    };
};



