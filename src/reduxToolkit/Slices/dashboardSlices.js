import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
  },
});

export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
