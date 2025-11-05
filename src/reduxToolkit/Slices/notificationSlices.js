import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url} from '../../config/config.js';
import { isLoggedIn } from "../../utils";

const initialState = {
    notificationData: [],
    loader: false,
}

//====================================notification List==========================================
export const notificationList = createAsyncThunk('notification/notificationList', async (payload, { rejectWithValue }) => {
    try {
        const token = isLoggedIn("userLogin");
        const response = await axios.get(`${Url}user/notificationList?`, {
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

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(notificationList.pending, (state) => {
                state.loader = true;
            })
            .addCase(notificationList.fulfilled, (state, action) => {
                state.loader = false;
                state.notificationData = action.payload;

            })
            .addCase(notificationList.rejected, (state, action) => {
                state.loader = false;
            })
    },
});

export default notificationSlice.reducer;