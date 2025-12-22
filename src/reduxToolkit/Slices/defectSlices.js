import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



import {getUrl } from '../../config/config';

const url = getUrl('defectdetection')

const initialState = {
    defectModal: [],
    defectTrainData: [],
    inferAccuracyData:[],
    loading: false,
}
//==========================================Hyper Tune======================================================
export const DefecthyperTune = createAsyncThunk('defect/hypertune', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}config_update`, payload);
        console.log(response, "internal response")
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
//==========================================defect infer======================================================
export const Defectinfer = createAsyncThunk('defect/infer', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}infer`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
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
//====================================Pre-trained-model(hyper tune)=====================================
export const DefectModal = createAsyncThunk('defect/hypertunemodel', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}models?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
        );
        // console.log(response, "response.data")
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
//=====================================get training api================================================
export const DefectModalTrain = createAsyncThunk('defect/train_infer', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}train_infer?username=${payload?.username}&task=${payload?.task}&project_name=${payload?.project}&version=${payload?.version}&model=${payload.model}`
        );
        // console.log(response, "response.data")
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
//================================return defect hyper tune====================================================
export const ReturnDefectHypertune = createAsyncThunk('defect/defecthypertune', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}get_config?username=${payload?.username}&task=${payload?.task}&project_name=${payload?.project_name}&version=${payload?.version}`
        );
        // console.log(response, "response.data")
        if (response.status === 200) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
})
//=====================================get infer accuracy================================================
export const InferAccuracy = createAsyncThunk('defect/accuracy', async (payload, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}confusion_matrix?username=${payload?.username}&task=${payload?.task}&project_name=${payload?.project}&version=${payload?.version}`
        );    
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
//======================================reducer=====================================================
const defectSlice = createSlice({
    name: 'defect',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(DefectModal.pending, (state) => {
                state.loading = true;
            })
            .addCase(DefectModal.fulfilled, (state, action) => {
                state.loading = false;
                state.defectModal = action.payload;
            })
            .addCase(DefectModal.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(DefectModalTrain.pending, (state) => {
                state.loading = true;
            })
            .addCase(DefectModalTrain.fulfilled, (state, action) => {
                state.loading = false;
                state.defectTrainData = action.payload;
            })
            .addCase(DefectModalTrain.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(InferAccuracy.pending, (state) => {
                state.loading = true;
            })
            .addCase(InferAccuracy.fulfilled, (state, action) => {
                state.loading = false;
                state.inferAccuracyData = action.payload;
            })
            .addCase(InferAccuracy.rejected, (state, action) => {
                state.loading = false;
            })
    },
});
export default defectSlice.reducer;