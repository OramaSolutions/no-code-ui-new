import {createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios'; // Add AxiosError import here


// ============================================ Resize Folder =============================================
export const ResizeFolder = createAsyncThunk<
  unknown,  // Return type
  { formData: FormData; signal: AbortSignal; url: string }  // Argument type
>(
  'project/resizeFolder',
  async ({ formData, signal, url }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}resize_images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: signal,
      });
      
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', (err as Error).message);
        return rejectWithValue({ message: 'Request canceled' });
      } else {
        const error = err as AxiosError;
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  }
);

// ========================================== Import Data ==================================================
export const importData = createAsyncThunk<
  unknown,  // Return type
  { payload: FormData; signal: AbortSignal; url: string }  // Argument type
>(
  'project/importData',
  async ({ payload, signal, url }, { rejectWithValue }) => {
    try {
      console.log('in project slice');
      console.log('Payload being sent:', payload);
      
      const response = await axios.post(`${url}import_dataset`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: signal,
      });
      
      console.log('response.....', response);
      
      if (response.status === 201) {
        return response;
      } else {
        return rejectWithValue(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
