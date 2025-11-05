import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

//=====================================auth login api=============================================================================
const initialState = {
  adminData: {},
  loading: false,
}

export const userLogin = createAsyncThunk('auth/userLogin', async (payload, { rejectWithValue }) => {
  try {

    const response = await axios.post(`${Url}user/userLogin`, payload, { withCredentials: true });

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
//====================================aut send email================================================================
export const sendEmail = createAsyncThunk('auth/sentEmail', async (payload, { rejectWithValue }) => {
  try {
    console.log("heloooo")
    const response = await axios.post(`${Url}user/sentEmail`, payload);
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

//====================================auth reset password================================================================
export const SetPassword = createAsyncThunk('auth/setPassword', async (payload, { rejectWithValue }) => {
  try {
    console.log("heloooo")
    const response = await axios.put(`${Url}user/setPassword?token=${payload.token}`, { password: payload.password });
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

//============================================change password=================================================
export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.put(`${Url}user/changePassword`, payload, {
      headers: { Authorization: `${token}` },
    }); if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response.data);
  }
})
//===========================================update profile===================================================
export const updateProfile = createAsyncThunk('auth/updateprofile', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${Url}user/editProfile`, payload, {
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
//================================================view profile api==========================
export const viewProfile = createAsyncThunk('auth/viewprofile', async (undefined, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.get(`${Url}user/viewProfile`, {
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
        window.localStorage.setItem('userLogin', JSON.stringify(action.payload));
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export default authSlice.reducer;
