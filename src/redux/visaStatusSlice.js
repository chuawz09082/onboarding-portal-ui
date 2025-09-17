import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/http';

// Helper to normalize API shapes
const pickStatuses = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.visaStatus)) return data.visaStatus;
  if (Array.isArray(data?.statuses)) return data.statuses;
  return []; // fallback
};

// GET /api/visa/employee/{employeeId}/visa_status
export const fetchVisaStatus = createAsyncThunk(
  'visaStatus/fetchVisaStatus',
  async (employeeId, thunkAPI) => {
    try {
      const { data } = await API.get(`/api/visa/employee/${employeeId}/visa_status`);
      return pickStatuses(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// PATCH /api/visa/employee/{employeeId}/visa_status
export const updateVisaStatus = createAsyncThunk(
  'visaStatus/updateVisaStatus',
  async ({ employeeId, updatedStatus }, thunkAPI) => {
    try {
      const { data } = await API.patch(
        `/api/visa/employee/${employeeId}/visa_status`,
        updatedStatus
      );
      return pickStatuses(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  statusList: [],
  loading: false,
  error: null,
  editMode: false,
  editedStatus: null,
};

const visaStatusSlice = createSlice({
  name: 'visaStatus',
  initialState,
  reducers: {
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    setEditedStatus(state, action) {
      state.editedStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchVisaStatus.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchVisaStatus.fulfilled, (s,a) => { s.loading = false; s.statusList = a.payload; })
      .addCase(fetchVisaStatus.rejected,  (s,a) => { s.loading = false; s.error = a.payload; })
      // update
      .addCase(updateVisaStatus.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(updateVisaStatus.fulfilled, (s,a) => {
        s.loading = false;
        s.statusList = a.payload;
        s.editMode = false;
        s.editedStatus = null;
      })
      .addCase(updateVisaStatus.rejected,  (s,a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setEditMode, setEditedStatus } = visaStatusSlice.actions;
export default visaStatusSlice.reducer;









































































