import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    classhypertuneModel: [],
    datasplitImages: [],
    previewImages: null,
    loading: false,
    previewLoading: false,

}

//==========================================import the data==================================================
export const importClassData = createAsyncThunk('classification/importData', async ({ payload, signal, url }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}import_dataset_cls`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal: signal,
        });
        console.log('response.....', response)
        if (response.status === 201) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
    catch (err) {
        return rejectWithValue(err.response);
    }
})
//==========================================Augumentation=====================================================
export const ClassAugumentedData = createAsyncThunk('classification/augumentation', async ({ payload, signal, url }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}augment_cls`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            signal: signal,
        });
        console.log(response, "response................")
        if (response.status === 201) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//============================================augumented images preview==================================
export const ClassAgumentedImage = createAsyncThunk('classification/agumentedImage', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}preview_images_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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

//==============================================agumented generated images============================
export const ClassAgumentedGeneratedImage = createAsyncThunk('classification/agumentedgeneratedImage', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}view_generated_images_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
//============================================Data split Prevuew Images======================================
export const PreviewDataSplitImages = createAsyncThunk(
    'classification/previewDataSplitImages',
    async ({ payload, url }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${url}preview_images_data_split_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
            );
            // console.log(response, "preview response.data")
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const ClassDataSplitImages = createAsyncThunk('classification/datasplitimages', async ({ payload, url }, { rejectWithValue }) => {
    try {

        const response = await axios.get(`${url}split_data_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}&split_ratio=${payload?.split_ratio}`
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
//====================================Pre-trained-model(hyper tune)=====================================
export const ClassHypetTuneModal = createAsyncThunk('classification/classhypertunemodel', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}models_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
//==========================================Hyper Tune======================================================
export const ClasshyperTune = createAsyncThunk('classification/hypertune', async ({ payload, url }, { rejectWithValue }) => {
    try {
        console.log('payload', payload, url)
        const response = await axios.post(`${url}tune_hyperparameter_cls`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.status === 201) {
            return response.data;
        } else {
            return rejectWithValue(response.data);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})
//====================================return class agumentation==========================================
export const ReturnClassAgumentation = createAsyncThunk('classification/ReturnClassagumentation', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}return_augmentations?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
        );
        console.log(response, "response data of agumentation")
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
//================================return data splitt=====================================================
export const ReturnClassDataSplit = createAsyncThunk('classification/ReturnClassDataSplit', async ({ payload, url }, { rejectWithValue }) => {
    try {
        console.log("payload in return split data cls", payload)
        const response = await axios.get(`${url}return_split_data_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
        );
        // console.log(response, "response.data")
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
//================================return class hyper tune====================================================
export const ReturnClassHypertune = createAsyncThunk('classification/ReturnClassHypertune', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${url}return_tune_hyperparameter_cls?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
        );
        // console.log(response, "response.data")
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
//=============================================data Transfer stop api==================================

export const ClassStopDataTransfer = createAsyncThunk('classification/classStopDataTransfer', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}stop_cls`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",

            },
        });
        console.log(response, "response................")
        if (response.status === 200) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
    catch (err) {
        return rejectWithValue(err.response.data);
    }
})

//===============================================class infer images====================================
export const ClassinferImages = createAsyncThunk('classification/inferimages', async ({ payload, url }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${url}inference_yolov8_cls`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(response, "response................")
        if (response.status === 201) {
            return response;
        } else {
            return rejectWithValue(response);
        }
    }
    catch (err) {
        return rejectWithValue(err.response);
    }
})

const classificationSlice = createSlice({
    name: 'classification',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(ClassHypetTuneModal.pending, (state) => {
                state.loading = true;
            })
            .addCase(ClassHypetTuneModal.fulfilled, (state, action) => {
                state.loading = false;
                state.classhypertuneModel = action.payload;
            })
            .addCase(ClassHypetTuneModal.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(ClassDataSplitImages.pending, (state) => {
                state.loading = true;
            })
            .addCase(ClassDataSplitImages.fulfilled, (state, action) => {
                state.loading = false;
                // state.datasplitImages = action.payload;
            })
            .addCase(ClassDataSplitImages.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(PreviewDataSplitImages.pending, (state) => {
                state.previewLoading = true;
            })
            .addCase(PreviewDataSplitImages.fulfilled, (state, action) => {
                state.previewLoading = false;
                state.previewImages = action.payload;
            })
            .addCase(PreviewDataSplitImages.rejected, (state, action) => {
                state.previewLoading = false;
            })
    },
});
export default classificationSlice.reducer;