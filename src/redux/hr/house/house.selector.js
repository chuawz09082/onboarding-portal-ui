import { createSelector } from "@reduxjs/toolkit";

const selectHouseState = (state) => state.house;

export const selectHouseList = createSelector(
  selectHouseState,
  (house) => house.houseList
);

export const selectHouseById = createSelector(
  selectHouseState,
  (house) => house.house
);

