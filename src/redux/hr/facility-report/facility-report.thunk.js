import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";

export const getFacilityReportsThunk = createAsyncThunk(
  "house/getFacilityReportsThunk",
  async (facilityId) => {
    const { data } = await Axios.get(
      `http://localhost:8084/api/v1/facilities/${facilityId}/reports`
    );
    return { data };
  }
);

export const getFacilityReportByIdThunk = createAsyncThunk(
  "facilityReport/getFacilityReportById",
  async (id) => {
    console.log("Fetching report with ID:", id);
    const response = await Axios.get(
      `http://localhost:8084/api/v1/facilities/reports/${id}`
    );
    return response.data;
  }
);

// Add new comment
export const addCommentThunk = createAsyncThunk(
  "facilityReport/addComment",
  async ({ reportId, comment }) => {
    const response = await Axios.post(
      `http://localhost:8084/api/v1/facilities/reports/${reportId}/comments`,
      { comment: comment, employeeId: 1 }
    );
    return { reportId, data: response.data };
  }
);

// Update comment
export const updateCommentThunk = createAsyncThunk(
  "facilityReport/updateComment",
  async ({ reportId, commentId, comment }) => {
    const response = await Axios.patch(
      `http://localhost:8084/api/v1/facilities/reports/${reportId}/comments/${commentId}`,
      { comment: comment }
    );
    return { reportId, commentId, data: response.data };
  }
);
