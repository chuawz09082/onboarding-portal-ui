export const selectPersonalInfo = (state) => state.personalInfo.personalData;
export const selectPersonalInfoStatus = (state) => state.personalInfo.status;
export const selectPersonalInfoError = (state) => state.personalInfo.error;
export const selectEmployeeReportData = (state) =>
  state.personalInfo.employeesData;
