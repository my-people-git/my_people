import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserDetailsInitialType,
  StatusType,
  UserDataType,
} from "types/userDetails.types";
const initialState: UserDetailsInitialType = {
  userData: null,
  status: "idle",
  requests: [],
  frineds: [],
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDetailsInitialType>) => {
      state.status = "success";
      state.userData = action.payload.userData;
    },
    setRequestsData: (state, action: PayloadAction<UserDataType[]>) => {
      state.requests = action.payload;
    },
    setFriendsData: (state, action: PayloadAction<UserDataType[]>) => {
      state.frineds = action.payload;
    },
    setUserStatus: (state, actions: PayloadAction<StatusType>) => {
      state.status = actions.payload;
    },
  },
});

export const { setUserData, setUserStatus, setRequestsData, setFriendsData } =
  userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;
