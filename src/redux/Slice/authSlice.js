import { createSlice } from '@reduxjs/toolkit';

// Safe JSON parsing function
function safeParse(item) {
    try {
        return JSON.parse(item);
    } catch (error) {
        //console.error("Error parsing JSON from localStorage:", error);
        return null;
    }
}

const initialState = {
    user: safeParse(localStorage.getItem("user")),
    token: localStorage.getItem("token"),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        login(state, action) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.error = null;
        },
        resetAuthState: () => initialState
    }
});

export const { loginStart, login, loginFailure, logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
