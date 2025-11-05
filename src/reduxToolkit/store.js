import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../reduxToolkit/Slices/authSlices.js"
import projectSlice from "../reduxToolkit/Slices/projectSlices.js"
import openSlice from "../reduxToolkit/Slices/openSlices.js"
import dashboardSlice from "../reduxToolkit/Slices/dashboardSlices.js"
import notificationSlice from "../reduxToolkit/Slices/notificationSlices.js"
import stepSlice from "../reduxToolkit/Slices/stepSlices"
import classificationSlice from "../reduxToolkit/Slices/classificationSlices.js"
import defectSlice from "../reduxToolkit/Slices/defectSlices.js"

const store = configureStore({
  reducer: {
  auth:authReducer,
  project:projectSlice,
  openProject:openSlice,
  dashboard:dashboardSlice,
  notification:notificationSlice,
  steps:stepSlice,
  classification:classificationSlice,
  defectDetection:defectSlice,
  },
});

export default store;
