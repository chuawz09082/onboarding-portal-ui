import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";

export const getHouseListThunk = createAsyncThunk(
  "house/getHouseListThunk",
  async () => {
    const { data } = await Axios.get("http://localhost:8084/api/v1/houses");
    return data;
  }
);

export const addHouseThunk = createAsyncThunk(
  "house/addHouseThunk",
  async (house) => {
    const result = await Axios.post(
      "http://localhost:8084/api/v1/houses",
      house
    );
    return result;
  }
);
