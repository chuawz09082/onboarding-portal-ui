import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice'

const store = configureStore({
    reducer: {
        auth
    },
    devTools : true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;