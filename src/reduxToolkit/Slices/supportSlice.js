import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

//====================================help and support======================================
export const createSupport = createAsyncThunk('auth/createsupport', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${Url}user/createSupport`, payload, {
      headers: { Authorization: `${token}` },
    });
    if (response.status === 200) {
      return response;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response.data);
  }
})
//===============================================upload image or video=================================
export const UploadDocumnet = createAsyncThunk('project/uploaddocumnet', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${Url}user/uploadDocumnet`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response, "response................")
    if (response.status === 200) {
      return response;
    } else {
      return rejectWithValue(response);
    }
  }
  catch (err) {
    return rejectWithValue(err.response);
  }
})