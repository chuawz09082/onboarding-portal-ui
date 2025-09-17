import { configureStore } from '@reduxjs/toolkit';

// Existing slices
import auth from './authSlice';
import house from '../hr/house/house.slice';
import personalInfo from "../employee/personal-info/personal-info.slice"
import facilityReport from '../hr/facility-report/facility-report.slice';

// New slices from the other store
import visaStatus from '../visaStatusSlice';
import documents from '../documentsSlice';

export const store = configureStore({
  reducer: {
    // keep the keys stable to avoid breaking selectors
    auth,
    house,
    facilityReport,
    personalInfo,

    // add the new feature keys
    visaStatus,
    documents,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// If the rest of your app imports a default export:
export default store;