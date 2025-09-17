import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to fetch documents list for an employee
export const fetchDocuments = createAsyncThunk(
    'documents/fetchDocuments',
    async (employeeId, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/visa/documents/${employeeId}/list`)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Async thunk to upload a document
export const uploadDocument = createAsyncThunk(
    'documents/uploadDocument',
    async ({ employeeId, file, type, comment }, thunkAPI) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        if (comment) formData.append('comment', comment)

        try {
            const response = await axios.post(`http://localhost:8080/api/visa/employee/${employeeId}/upload`, formData)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const initialState = {
    documents: [],
    loading: false,
    error: null,
}

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments(state, action) {
            state.documents = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch documents cases
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false
                state.documents = action.payload
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Upload document cases
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(uploadDocument.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setDocuments, setLoading, setError } = documentsSlice.actions
export default documentsSlice.reducer