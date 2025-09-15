import { createSelector } from "@reduxjs/toolkit";

const selectFacilityReportState = (state) => state.facilityReport;

export const selectFacilityReport = createSelector(
  selectFacilityReportState,
  (facilityReport) => facilityReport.facilityReportList
);
