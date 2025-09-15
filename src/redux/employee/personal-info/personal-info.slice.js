import { createSlice } from '@reduxjs/toolkit';
import { getPersonalInfoThunk, editPersonalInfoThunk } from './personal-info.thunk';

const personalInfoSlice = createSlice({
    name: "personalInfo",
    initialState: {
        personalData: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPersonalInfoThunk.fulfilled, (state, action) => {
            console.log("retrieved personal information")
            state.status = "successful";
            state.personalData = { ...action.payload};
        });
        builder.addCase(getPersonalInfoThunk.rejected, (state, action) => {
            console.log("failed to retrieve personal information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(getPersonalInfoThunk.pending, (state, action) => {
            console.log("personal information pending")
            state.status = "loading";
        });
        builder.addCase(editPersonalInfoThunk.fulfilled, (state, action) => {
            console.log("updated personal information")
            state.status = "successful";
        });
        builder.addCase(editPersonalInfoThunk.rejected, (state, action) => {
            console.log("failed to update personal information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(editPersonalInfoThunk.pending, (state, action) => {
            console.log("personal information update pending")
            state.status = "loading";
        });

            
    }
})

export default personalInfoSlice.reducer;