import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projectData: [],
    versionData: [],
    loader: false,
};

const openSlice = createSlice({
    name: 'openProject',
    initialState,
    reducers: {
        setProjectData: (state, action) => {
            console.log('action payload', action.payload)
            state.projectData = action.payload;
        },

        setVersionData: (state, action) => {
            state.versionData = action.payload;
        },

        setLoader: (state, action) => {
            state.loader = action.payload;
        },

        resetProjectState: () => initialState,
    },
});

export const {
    setProjectData,
    setVersionData,
    setLoader,
    resetProjectState,
} = openSlice.actions;

export default openSlice.reducer;
