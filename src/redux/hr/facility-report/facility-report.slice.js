import { createSlice } from "@reduxjs/toolkit";
import {
  addCommentThunk,
  getFacilityReportByIdThunk,
  getFacilityReportsThunk,
} from "./facility-report.thunk";

const facilityReportSlice = createSlice({
  name: "facilityReport",
  initialState: {
    facilityReportList: [],
    facilityReportDetails: {},
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder, state) => {
    builder.addCase(getFacilityReportsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.facilityReportList = action.payload.data.data;
    });
    builder.addCase(getFacilityReportsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(getFacilityReportsThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getFacilityReportByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.facilityReportDetails = action.payload.data.data;
    });
    builder.addCase(getFacilityReportByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(getFacilityReportByIdThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addCommentThunk.fulfilled, (state, action) => {
      state.loading = false;
      // state.facilityReportDetails = action.payload.data.data;
    });
    builder.addCase(addCommentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(addCommentThunk.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export default facilityReportSlice.reducer;
