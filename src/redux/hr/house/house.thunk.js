import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { getFacilityReportsThunk } from "../facility-report/facility-report.thunk";
const url = "http://localhost:9000/house-service"
export const getHouseListThunk = createAsyncThunk(
  "house/getHouseListThunk",
  async () => {
    const { data } = await Axios.get(`${url}/api/v1/houses`);
    return data;
  }
);

export const addHouseThunk = createAsyncThunk(
  "house/addHouseThunk",
  async (house) => {
    const { data } = await Axios.post(
      `${url}/api/v1/houses`,
      house
    );
    return data;
  }
);

export const deleteHouseThunk = createAsyncThunk(
  "house/deleteHouseThunk",
  async (id) => {
    await Axios.delete(`${url}/api/v1/houses/` + id);
  }
);

export const getHouseByIdThunk = createAsyncThunk(
  "house/getHouseByIdThunk",
  async (houseId, thunkAPI) => {
    const response = await Axios.get(
      `${url}/api/v1/houses/` + houseId
    );

    const data = response.data.data;

    data.facilityList.forEach((facility) => {
      thunkAPI.dispatch(getFacilityReportsThunk(facility.id));
    });
    return data;
  }
);

export const getEmployeeByHouseIdThunk = createAsyncThunk(
  "house/getEmployeeByHouseIdThunk",
  async (id) => {
    const response = await Axios.get(
      `http://localhost:9000/employee-service/api/v1/employees/house/${id}`
    );

    const data = response.data.data;
    return data;
  }
);
