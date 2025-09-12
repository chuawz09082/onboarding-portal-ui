import { createSlice } from "@reduxjs/toolkit";
import getHouseListThunk from "./house.thunk";

const houseSlice = createSlice({
  name: "house",
  initialState: {
    houseList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder, state) => {
    builder.addCase(getHouseListThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.houseList = action.payload;
    });
    builder.addCase(getHouseListThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(getHouseListThunk.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export default houseSlice.reducer;
