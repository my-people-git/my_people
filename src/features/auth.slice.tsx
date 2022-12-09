import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetailsInitialType, StatusType } from "types/userDetails.types";
const initialState: UserDetailsInitialType = {
  userData: null,
  status: "idle",
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDetailsInitialType>) => {
      state.status = "success";
      state.userData = action.payload.userData;
    },
    setUserStatus: (state, actions: PayloadAction<StatusType>) => {
      state.status = actions.payload;
    },
  },
});

export const { setUserData, setUserStatus } = userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;
