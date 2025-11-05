import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Url } from '../../config/config.js';
import { isLoggedIn } from "../../utils";

let path = window.location.href.split("/")?.at(-1)

//============================================resize the folder=============================================
export const ResizeFolder = createAsyncThunk('project/resizeFolder', async ({ payload, signal, url }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}resize_images`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: signal,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      return rejectWithValue({ message: 'Request canceled' });
    } else {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
});
//==========================================import the data==================================================
export const importData = createAsyncThunk('project/importData', async ({ payload, signal, url }, { rejectWithValue }) => {
  try {
    console.log('in project slice')
    console.log('Payload being sent:', payload);
    const response = await axios.post(`${url}import_dataset`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: signal,
    });
    console.log('response.....', response)
    // console.log(response, "response................")
    if (response.status === 201) {
      // console.log(response.data, "response.data")
      return response;
    } else {
      return rejectWithValue(response || response);
    }
  }
  catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
})
//==========================================Augumentation=====================================================
export const AugumentedData = createAsyncThunk('project/augumentation', async ({ payload, signal, url }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}augment`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: signal,
    });
    // console.log(response, "response................")
    if (response.status === 201) {
      // console.log(response.data, "response.data")
      return response.data;
    } else {
      return rejectWithValue(response.data);
    }
  }
  catch (err) {
    return rejectWithValue(err.response.data);
  }
})
//==========================================Data Split===============================================
export const DataSplits = createAsyncThunk('project/datasplit', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}split_data`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
//==========================================Hyper Tune=================================================
export const hyperTune = createAsyncThunk('project/hypertune', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}tune_hyperparameter`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
export const AgumentedImage = createAsyncThunk('project/agumentedImage', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}preview_images?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
export const AgumentedGeneratedImage = createAsyncThunk('project/agumentedgeneratedImage', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}view_generated_images?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
export const HypetTuneModal = createAsyncThunk('project/hypertunemodel', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}models_download?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
export const DataSplitImages = createAsyncThunk('project/datasplitimages', async ({ payload, url }, { rejectWithValue }) => {
  try {

    const response = await axios.get(`${url}split_data?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}&split_ratio=${payload?.split_ratio}`
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
//======================================Data Transfer response==========================================
export const DataTransfer = createAsyncThunk('project/datatransfer', async ({ payload, url }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${url}train_yolov8`,
      params: {
        username: payload?.username,
        task: payload?.task,
        project: payload?.project,
        version: payload?.version
      },
      responseType: 'stream'
    });
    console.log(response, "checking the real-time response")
    if (response.status !== 200) {
      return rejectWithValue(response.data);
    }


    const reader = response?.data.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream complete");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;


      dispatch(updateStreamingData(chunk));
    }

    return result;

  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
})
//===================================training batch api==============================================
export const TrainingbatchApi = createAsyncThunk('project/Trainingbatch', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const newPoint = payload?.task == "classification" ? "training_batches_cls" : "training_batches"
    const response = await axios.get(`${url}${newPoint}?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
//===============================================infer images============================================
export const inferImages = createAsyncThunk('project/inferimages', async ({ payload, url }, { rejectWithValue }) => {
  // try {
  //   const response = await axios.post(`${url}infer_image`, payload, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   console.log(response, "response................")
  //   if (response.status === 201) {
  //     return response;
  //   } else {
  //     return rejectWithValue(response);
  //   }
  // }
  // catch (err) {
  //   return rejectWithValue(err.response);
  // }


  const res = await axios.post(`${url}infer_image`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: 'blob',
    validateStatus: () => true,
  });

  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    // Try parse JSON error from blob
    try {
      const text = await res.data.text();
      const err = JSON.parse(text || '{}');
      return (err.message || 'Inference failed');
    } catch {
      return ('Inference failed');
    }
  }
})

//=============================================data Transfer stop api==================================
export const StopDataTransfer = createAsyncThunk('project/StopDataTransfer', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${url}stop`, payload, {
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
//======================================create project===================================================

export const createProject = createAsyncThunk('project/createproject', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${Url}user/createProject`, payload, {
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

//======================================create project===================================================

export const checkProject = createAsyncThunk('project/checkproject', async (payload, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${Url}user/checkProject`, payload, {
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

//=============================================remark data================================================
export const remarkData = createAsyncThunk('project/remarkdata', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.post(`${url}remark`, payload, {
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

export const getRemarkData = createAsyncThunk('project/getRemarkData', async ({ url, username, task, project, version }, { rejectWithValue }) => {
  try {
    const token = isLoggedIn("userLogin");
    const response = await axios.get(`${url}remark`, {
      headers: { Authorization: `${token}` },
      params: {
        username,
        task,
        project,
        version
      }
    });
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

//====================================return agumentation==========================================
export const ReturnAgumentation = createAsyncThunk('project/Returnagumentation', async ({ payload, url }, { rejectWithValue }) => {
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
export const ReturnDataSplit = createAsyncThunk('project/ReturnDataSplit', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}return_split_ratio?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
//================================return hyper tune======================================================
export const ReturnHypertune = createAsyncThunk('project/ReturnHypertune', async ({ payload, url }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${url}return_tune_hyperparameter?username=${payload?.username}&task=${payload?.task}&project=${payload?.project}&version=${payload?.version}`
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
//=============================================project reducer============================================
const initialState = {
  agumentedImages: [],
  agumentedGeneratedImages: [],
  hypertuneModel: [],
  totalImages: 0,
  dataTransferResult: "",
  loading: false,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateStreamingData: (state, action) => {
      console.log(action.payload, "action.payload")
      state.dataTransferResult += action.payload;  // Append new data chunks to the existing result
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgumentedImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(AgumentedImage.fulfilled, (state, action) => {
        state.loading = false;
        state.agumentedImages = action.payload;
      })
      .addCase(AgumentedImage.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(AgumentedGeneratedImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(AgumentedGeneratedImage.fulfilled, (state, action) => {
        state.loading = false;
        state.agumentedGeneratedImages = action.payload;
      })
      .addCase(AgumentedGeneratedImage.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(HypetTuneModal.pending, (state) => {
        state.loading = true;
      })
      .addCase(HypetTuneModal.fulfilled, (state, action) => {
        state.loading = false;
        state.hypertuneModel = action.payload;
      })
      .addCase(HypetTuneModal.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(DataSplitImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(DataSplitImages.fulfilled, (state, action) => {
        state.loading = false;
        state.totalImages = action.payload.total_images;
      })
      .addCase(DataSplitImages.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(DataTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(DataTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.dataTransferResult = action.payload;
      })
      .addCase(DataTransfer.rejected, (state, action) => {
        state.loading = false;
      })
  },
});
export const { updateStreamingData } = projectSlice.actions;
export default projectSlice.reducer;