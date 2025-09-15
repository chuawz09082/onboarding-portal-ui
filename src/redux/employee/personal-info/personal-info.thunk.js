import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const placeholderId = "mongo_emp_001"
const id = placeholderId
//const id = 1
const url = "http://localhost:9000/employee-service/api/employees/"
//const url = "https://jsonplaceholder.typicode.com/todos/"

export const getPersonalInfoThunk = createAsyncThunk(
    "personalInfo/getPersonalInfoThunk",
    async () => {
        console.log(url+id)
        const response = await axios.get(
            url + id
        );
        return await response.data;
    }

)

export const editPersonalInfoThunk = createAsyncThunk(
    "personalInfo/editPersonalInfoThunk",
    async (personalData) => {
        const response = await axios.patch(
            url + id,
            personalData
        );
        return response;
    }
)