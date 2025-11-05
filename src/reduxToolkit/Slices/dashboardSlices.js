import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
    dashboardData: [],
    loader: false,
}
//==================================project list======================================================
export const dashboardList = createAsyncThunk('dashboard/dashboardlist', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("userLogin");
        
        const response = await axios.get(`${Url}user/myLatestProjectList`, {
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

//=======================================reducer==============================================================
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(dashboardList.pending, (state) => {
                state.loader = true;
            })
            .addCase(dashboardList.fulfilled, (state, action) => {
                state.loader = false;
                state.dashboardData = action.payload;

            })
            .addCase(dashboardList.rejected, (state, action) => {
                state.loader = false;
            })
    },
});

export default dashboardSlice.reducer;