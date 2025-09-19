import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const placeholderId = "mongo_emp_001";
const id = placeholderId;
//const id = 1
const url = "http://localhost:9000/employee-service/api/employees/";
//const url = "https://jsonplaceholder.typicode.com/todos/"

export const getPersonalInfoThunk = createAsyncThunk(
  "personalInfo/getPersonalInfoThunk",
  async () => {
    console.log(url + id);
    const response = await axios.get(url + id);
    return await response.data;
  }
);

export const getPersonalInfoByIdsThunk = createAsyncThunk(
  "personalInfo/getPersonalInfoByIdsThunk",
  async (employeeIds) => {
    const response = await axios.post(
      "http://localhost:9000/employee-service/api/v1/employees/by-ids",
      employeeIds
    );

    return response.data.data;
  }
);

// export const editPersonalInfoThunk = createAsyncThunk(
//     "personalInfo/editPersonalInfoThunk",
//     async (personalData) => {
//         console.log(personalData)
//         const response = await axios.patch(
//             url + id,
//             personalData
//         );
//         return response;
//     }
// )

export const editNameSectionThunk = createAsyncThunk(
  "personalInfo/editNameSectionThunk",
  async (personalData) => {
    // console.log(url + "name/" + id)
    // console.log(JSON.stringify(personalData))
    const response = await axios.patch(url + "name/" + id, personalData);
    return response;
  }
);

export const editAddressSectionThunk = createAsyncThunk(
  "personalInfo/editAddressSectionThunk",
  async (personalData) => {
    // console.log(url + "name/" + id)
    // console.log(JSON.stringify(personalData))
    const response = await axios.patch(url + "address/" + id, personalData);
    return response;
  }
);

export const editContactSectionThunk = createAsyncThunk(
  "personalInfo/editContactSectionThunk",
  async (personalData) => {
    // console.log(url + "name/" + id)
    // console.log(JSON.stringify(personalData))
    const response = await axios.patch(url + "contact/" + id, personalData);
    return response;
  }
);

export const editEmploymentSectionThunk = createAsyncThunk(
  "personalInfo/editEmploymentSectionThunk",
  async (personalData) => {
    // console.log(url + "name/" + id)
    // console.log(JSON.stringify(personalData))
    const response = await axios.patch(url + "employment/" + id, personalData);
    return response;
  }
);

export const editEmergencyContactSectionThunk = createAsyncThunk(
  "personalInfo/editEmergencyContactSectionThunk",
  async (personalData) => {
    // console.log(url + "name/" + id)
    // console.log(JSON.stringify(personalData))
    const response = await axios.patch(
      url + "emergency-contact/" + id,
      personalData
    );
    return response;
  }
);
