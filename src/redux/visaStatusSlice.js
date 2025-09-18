import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/http';

// Normalize API shapes -> always an array of statuses
const pickStatuses = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.visaStatus)) return data.visaStatus;
  if (Array.isArray(data?.statuses)) return data.statuses;
  return [];
};

// GET /api/visa/employee/{employeeId}/visa_status
export const fetchVisaStatus = createAsyncThunk(
  'visaStatus/fetchVisaStatus',
  async (employeeId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/api/visa/employee/${encodeURIComponent(employeeId)}/visa_status`
      );
      return pickStatuses(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        return rejectWithValue('Employee ID not found.');
      }
      if (status === 401) {
        return rejectWithValue('Your session expired or is invalid. Please sign in again.');
      }
      return rejectWithValue('Could not load visa status. Please try again.');
    }
  }
);

// PATCH /api/visa/employee/{employeeId}/visa_status
export const updateVisaStatus = createAsyncThunk(
  'visaStatus/updateVisaStatus',
  async ({ employeeId, updatedStatus }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(
        `/api/visa/employee/${encodeURIComponent(employeeId)}/visa_status`,
        updatedStatus
      );
      return pickStatuses(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) return rejectWithValue('Employee ID not found.');
      if (status === 401) return rejectWithValue('Your session expired or is invalid. Please sign in again.');
      return rejectWithValue('Could not update visa status. Please try again.');
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
    clearVisaError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchVisaStatus.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(fetchVisaStatus.fulfilled, (s,a)  => { s.loading = false; s.statusList = a.payload; })
      .addCase(fetchVisaStatus.rejected,  (s,a)  => { s.loading = false; s.error = a.payload || 'Failed to load visa status.'; })
      // update
      .addCase(updateVisaStatus.pending,   (s)   => { s.loading = true;  s.error = null; })
      .addCase(updateVisaStatus.fulfilled, (s,a) => {
        s.loading = false;
        s.statusList = a.payload;
        s.editMode = false;
        s.editedStatus = null;
      })
      .addCase(updateVisaStatus.rejected,  (s,a) => { s.loading = false; s.error = a.payload || 'Failed to update visa status.'; });
  },
});

export const { setEditMode, setEditedStatus, clearVisaError } = visaStatusSlice.actions;
export default visaStatusSlice.reducer;








































































