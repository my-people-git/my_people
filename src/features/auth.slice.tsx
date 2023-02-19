import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserDetailsInitialType,
  StatusType,
  Friend,
} from "types/userDetails.types";
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
    setUserStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      if (state.userData) {
        state.userData.friends = [...state.userData.friends, action.payload];
      }
    },
    removeFriend: (state, action),
  },
});

export const { setUserData, setUserStatus } = userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;
