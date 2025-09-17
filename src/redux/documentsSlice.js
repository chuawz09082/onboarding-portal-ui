import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/http'; // <-- use the axios instance with interceptors

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (employeeId, thunkAPI) => {
    try {
      const { data } = await API.get(`/api/visa/documents/${employeeId}/list`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ employeeId, file, type, comment }, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (comment) formData.append('comment', comment);

    try {
      // DO NOT set Content-Type manually; axios sets multipart boundary for FormData
      const { data } = await API.post(`/api/visa/employee/${employeeId}/upload`, formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = { documents: [], loading: false, error: null };

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action) => { state.documents = action.payload; },
    setLoading:   (state, action) => { state.loading = action.payload; },
    setError:     (state, action) => { state.error   = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchDocuments.fulfilled, (s,a) => { s.loading = false; s.documents = a.payload; })
      .addCase(fetchDocuments.rejected,  (s,a) => { s.loading = false; s.error = a.payload; })
      .addCase(uploadDocument.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(uploadDocument.fulfilled, (s) => { s.loading = false; })
      .addCase(uploadDocument.rejected,  (s,a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setDocuments, setLoading, setError } = documentsSlice.actions;
export default documentsSlice.reducer;