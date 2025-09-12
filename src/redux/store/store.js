import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice'
import houseReducer from "../hr/house/house.slice";

const store = configureStore({
    reducer: {
        auth,
        house: houseReducer,
    },
    devTools : true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;
