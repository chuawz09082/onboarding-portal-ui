import { createSelector } from "@reduxjs/toolkit";

const selectHouseState = (state) => state.house;

export const selectHouseList = createSelector(
  selectHouseState,
  (house) => house.houseList
);
