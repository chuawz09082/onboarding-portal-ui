import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to fetch visa status for an employee
export const fetchVisaStatus = createAsyncThunk(
    'visaStatus/fetchVisaStatus',
    async (employeeId, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/visa/employee/${employeeId}/visa_status`)
            return response.data.visaStatus // Extract visaStatus from Employee object
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Async thunk to update visa status for an employee
export const updateVisaStatus = createAsyncThunk(
    'visaStatus/updateVisaStatus',
    async ({ employeeId, updatedStatus }, thunkAPI) => {
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/visa/employee/${employeeId}/visa_status`,
                updatedStatus
            )
            return response.data.visaStatus
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message)
        }
    }
)

const initialState = {
    statusList: [],
    loading: false,
    error: null,
    editMode: false,
    editedStatus: null,
}

const visaStatusSlice = createSlice({
    name: 'visaStatus',
    initialState,
    reducers: {
        setEditMode(state, action) {
            state.editMode = action.payload
        },
        setEditedStatus(state, action) {
            state.editedStatus = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Visa Status cases
            .addCase(fetchVisaStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchVisaStatus.fulfilled, (state, action) => {
                state.loading = false
                state.statusList = action.payload
            })
            .addCase(fetchVisaStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Update Visa Status cases
            .addCase(updateVisaStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateVisaStatus.fulfilled, (state, action) => {
                state.loading = false
                state.statusList = action.payload
                state.editMode = false
                state.editedStatus = null
            })
            .addCase(updateVisaStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { setEditMode, setEditedStatus } = visaStatusSlice.actions
export default visaStatusSlice.reducer