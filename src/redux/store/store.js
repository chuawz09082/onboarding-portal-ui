import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice'
import houseReducer from "../hr/house/house.slice";
import facilityReportReducer from "../hr/facility-report/facility-report.slice";

const store = configureStore({
    reducer: {
        auth,
        house: houseReducer,
        facilityReport: facilityReportReducer
    },
    devTools : true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;
