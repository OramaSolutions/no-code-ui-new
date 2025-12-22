import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    wasAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            // console.log('Setting auth state with user data:', action.payload.user);
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
            state.wasAuthenticated = true;

        },

        logout: (state) => {
            // console.log('Logging out user, resetting auth state');
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.wasAuthenticated = false;
        },
        authResolved: (state) => {
            // console.log('Auth resolved without login');
            state.loading = false; // resolved but not logged in
        },
    },
});

export const { setAuth, logout, authResolved } = authSlice.actions;
export default authSlice.reducer;
