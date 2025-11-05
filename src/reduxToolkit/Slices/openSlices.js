import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
    projectData: [],
    versionData: [],
    loader: false,
}

//========================================project list=======================================================
export const projectList = createAsyncThunk('project/projectList', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("userLogin");
        const response = await axios.get(`${Url}user/myProjectList?model=${payload.model}&page=${payload.page}&startDate=${payload.startdate}&endDate=${payload.enddate}&search=${payload.search}&timeframe=${payload.timeFrame}`, {
            headers: { Authorization: `${token}` },
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//========================================project list===================================================
export const versionList = createAsyncThunk('project/versionList', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("userLogin");
        const response = await axios.get(`${Url}user/versionDropDown?name=${payload.projectName}`, {
            headers: { Authorization: `${token}` },
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//========================================project list========================================================
export const projectOpen = createAsyncThunk('project/projectOpen', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("userLogin");
        const response = await axios.post(`${Url}user/getProjectForOpen`, payload, {
            headers: { Authorization: `${token}` },
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//======================================================reducer======================================
const openSlice = createSlice({
    name: 'openProject',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(projectList.pending, (state) => {
                state.loader = true;
            })
            .addCase(projectList.fulfilled, (state, action) => {
                state.loader = false;
                state.projectData = action.payload;

            })
            .addCase(projectList.rejected, (state, action) => {
                state.loader = false;
            })
            .addCase(versionList.pending, (state) => {
                state.loader = true;
            })
            .addCase(versionList.fulfilled, (state, action) => {
                state.loader = false;
                state.versionData = action.payload;

            })
            .addCase(versionList.rejected, (state, action) => {
                state.loader = false;
            })
    },
});

export default openSlice.reducer;