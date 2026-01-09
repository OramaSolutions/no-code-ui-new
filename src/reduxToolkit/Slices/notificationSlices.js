import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import axiosInstance from '../../api/axiosInstance.js';

const initialState = {
    notificationData: [],
    loader: false,
}

//====================================notification List==========================================
// need axios instance
export const notificationList = createAsyncThunk('notification/notificationList', async (payload, { rejectWithValue }) => {
    try {

        const response = await axiosInstance.get(`${Url}user/notifications?`);
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

export const markNotificationRead = createAsyncThunk(
    "notification/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${Url}user/notifications/${notificationId}/read`
            );

            if (response.status === 200) {
                return {
                    id: notificationId,
                    data: response.data,
                };
            }

            return rejectWithValue(response.data);
        } catch (err) {
            return rejectWithValue(err?.response?.data || "Something went wrong");
        }
    }
);


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
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const id = action.payload.id;

                const notif = state.notificationData?.notifications?.find(
                    n => n._id === id
                );

                if (notif) {
                    notif.isRead = true;
                }
            });
    },
});

export default notificationSlice.reducer;