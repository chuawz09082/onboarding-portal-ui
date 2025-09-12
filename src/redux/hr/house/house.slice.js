import { createSlice } from "@reduxjs/toolkit";
import { addHouseThunk, getHouseListThunk } from "./house.thunk";

const houseSlice = createSlice({
  name: "house",
  initialState: {
    houseList: [],
    loading: false,
    error: null,
    addHouseMessage: null,
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
    builder.addCase(addHouseThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.addHouseMessage = "House added successfully";
    });
    builder.addCase(addHouseThunk.rejected, (state, action) => {
      state.loading = false;
      state.addHouseMessage = "Failed to add house";
    });
    builder.addCase(addHouseThunk.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export default houseSlice.reducer;
