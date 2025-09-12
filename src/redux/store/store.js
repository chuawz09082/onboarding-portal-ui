import { configureStore } from "@reduxjs/toolkit";
import houseReducer from "../hr/house/house.slice";
const store = configureStore({
  reducer: {
    house: houseReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
