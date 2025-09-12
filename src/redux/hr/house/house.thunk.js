import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";

const getHouseListThunk = createAsyncThunk(
  "house/getHouseListThunk",
  async () => {
    const { data } = await Axios.get("http://localhost:8084/api/v1/houses");
    return data;
  }
);

export default getHouseListThunk;
