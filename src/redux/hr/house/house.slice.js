import { createSlice } from "@reduxjs/toolkit";
import {
  addHouseThunk,
  deleteHouseThunk,
  getEmployeeByHouseIdThunk,
  getHouseByIdThunk,
  getHouseListThunk,
} from "./house.thunk";

const houseSlice = createSlice({
  name: "house",
  initialState: {
    houseList: [],
    house: {},
    employees:[],
    loading: false,
    error: null,
    addHouseMessage: "",
    deleteHouseMessage: "",
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
    builder.addCase(deleteHouseThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.deleteHouseMessage = "House delete successfully";
    });
    builder.addCase(deleteHouseThunk.rejected, (state, action) => {
      state.loading = false;
      state.deleteHouseMessage = "Failed to delete house";
    });
    builder.addCase(deleteHouseThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getHouseByIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.house = action.payload;
    });
    builder.addCase(getHouseByIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(getHouseByIdThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getEmployeeByHouseIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    });
    builder.addCase(getEmployeeByHouseIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = "Error";
    });
    builder.addCase(getEmployeeByHouseIdThunk.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export default houseSlice.reducer;
