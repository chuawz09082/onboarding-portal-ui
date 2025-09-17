import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../lib/http'; // <-- use the axios instance with interceptors

export const fetchDigitalDocuments = createAsyncThunk(
  'documents/fetchDigitalDocuments',
  async (thunkAPI) => {
    try {
      const { data } = await API.get("/application-service/api/onboarding/documents");
      return data;
    }
    catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);

    }
  }
);

const initialState = { digitalDocuments: [], loading: false, error: null };

const digitalDocumentsSlice = createSlice({
  name: 'digitalDocuments',
  initialState,
  reducers: {
    setDigitalDocuments: (state, action) => { state.digitalDocuments = action.payload; },
    setLoading:   (state, action) => { state.loading = action.payload; },
    setError:     (state, action) => { state.error   = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDigitalDocuments.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchDigitalDocuments.fulfilled, (s,a) => { s.loading = false; s.documents = a.payload; })
      .addCase(fetchDigitalDocuments.rejected,  (s,a) => { s.loading = false; s.error = a.payload; })
  },
});

export const { setDocuments, setLoading, setError } = documentsSlice.actions;
export default documentsSlice.reducer;