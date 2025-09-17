import { createSlice } from '@reduxjs/toolkit';
import { getPersonalInfoThunk, 
    editNameSectionThunk, 
    editAddressSectionThunk,
    editContactSectionThunk,
    editEmploymentSectionThunk,
    editEmergencyContactSectionThunk

} from './personal-info.thunk';

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


        // builder.addCase(editPersonalInfoThunk.fulfilled, (state, action) => {
        //     console.log("updated personal information")
        //     state.status = "successful";
        // });
        // builder.addCase(editPersonalInfoThunk.rejected, (state, action) => {
        //     console.log("failed to update personal information")
        //     console.log(action.error.message)
        //     state.status = "failed";
        //     state.error = action.error.message;
        // });
        // builder.addCase(editPersonalInfoThunk.pending, (state, action) => {
        //     console.log("personal information update pending")
        //     state.status = "loading";
        // });


        builder.addCase(editNameSectionThunk.fulfilled, (state, action) => {
            console.log("updated personal information")
            state.status = "successful";
        });
        builder.addCase(editNameSectionThunk.rejected, (state, action) => {
            console.log("failed to update personal information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(editNameSectionThunk.pending, (state, action) => {
            console.log("personal information update pending")
            state.status = "loading";
        });


        builder.addCase(editAddressSectionThunk.fulfilled, (state, action) => {
            console.log("updated address information")
            state.status = "successful";
        });
        builder.addCase(editAddressSectionThunk.rejected, (state, action) => {
            console.log("failed to update address information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });

        builder.addCase(editContactSectionThunk.fulfilled, (state, action) => {
            console.log("updated contact information")
            state.status = "successful";
        });
        builder.addCase(editContactSectionThunk.rejected, (state, action) => {
            console.log("failed to update contact information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });

        builder.addCase(editEmploymentSectionThunk.fulfilled, (state, action) => {
            console.log("updated contact information")
            state.status = "successful";
        });
        builder.addCase(editEmploymentSectionThunk.rejected, (state, action) => {
            console.log("failed to update contact information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });

        builder.addCase(editEmergencyContactSectionThunk.fulfilled, (state, action) => {
            console.log("updated contact information")
            state.status = "successful";
        });
        builder.addCase(editEmergencyContactSectionThunk.rejected, (state, action) => {
            console.log("failed to update contact information")
            console.log(action.error.message)
            state.status = "failed";
            state.error = action.error.message;
        });

            
    }
})

export default personalInfoSlice.reducer;