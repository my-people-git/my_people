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
        if (
          !!state.userData.friends.find(
            (friend) => friend.id === action.payload.id
          )
        ) {
          state.userData.friends = state.userData.friends.map((friend) =>
            friend.id === action.payload.id
              ? { ...friend, deleted: false }
              : friend
          );
        } else {
          state.userData.friends = [...state.userData.friends, action.payload];
        }
      }
    },
    removeFriend: (state, action: PayloadAction<String>) => {
      if (state.userData) {
        state.userData.friends = state.userData.friends.map((friend) =>
          friend.id === action.payload ? { ...friend, deleted: true } : friend
        );
      }
    },
  },
});

export const { setUserData, setUserStatus, addFriend, removeFriend } =
  userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;
