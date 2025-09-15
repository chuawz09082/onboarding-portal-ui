import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice'
import houseReducer from "../hr/house/house.slice";
import personalInfoReducer from "../employee/personal-info/personal-info.slice"

const store = configureStore({
    reducer: {
        auth,
        house: houseReducer,
        personalInfo: personalInfoReducer,
    },
    devTools : true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;
