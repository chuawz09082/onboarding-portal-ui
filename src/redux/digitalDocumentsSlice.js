import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/http'; // <-- use the axios instance with interceptors

export const fetchDigitalDocuments = createAsyncThunk(
  'documents/fetchDigitalDocuments',
  async (thunkAPI) => {
    try {
      const { data } = await API.get("/application-service/api/onboarding/documents");
      console.log(data);
      return data;
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);

    }
  }
);

export const uploadDigitalDocument = createAsyncThunk(
  'documents/uploadDigitalDocument',
  async ({ employeeId, file, type, comment }, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (comment) formData.append('comment', comment);

    try {
      // DO NOT set Content-Type manually; axios sets multipart boundary for FormData
      const { data } = await API.post(`/api/visa/employee/${employeeId}/upload/onboarding`, formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = { 
    digitalDocuments: [],
    // uploadedFiles: {}, 
    loading: false, 
    error: null 
};

const digitalDocumentsSlice = createSlice({
  name: 'digitalDocuments',
  initialState,
  reducers: {
    setDigitalDocuments: (state, action) => { state.digitalDocuments = action.payload; },
    // uploadFile: (state, action) => { 
    //     const { id, file } = action.payload;
    //     state.uploadedFiles[id] = file;
    // },
    setLoading:   (state, action) => { state.loading = action.payload; },
    setError:     (state, action) => { state.error   = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDigitalDocuments.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchDigitalDocuments.fulfilled, (s,a) => { s.loading = false; s.digitalDocuments = a.payload; })
      .addCase(fetchDigitalDocuments.rejected,  (s,a) => { s.loading = false; s.error = a.payload; })
  },
});

export const { setDocuments, uploadFile, setLoading, setError } = digitalDocumentsSlice.actions;
export default digitalDocumentsSlice.reducer;