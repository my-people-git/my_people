import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";
import { Button } from "@mui/material";

export const Header = () => {
  const dispatch = useAppDispatch();
  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setUserData({ userData: null, status: "idle" }));
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <header className="w-100 h-15 bg-blue-400 sticky top-0 right-0 left-0 flex flex-wrap content-center justify-end ">
      <div
        className="w-10 h-10 bg-blue-600 rounded-full p-2 m-2"
        onClick={logoutUser}
      >
        GD
      </div>
    </header>
  );
};
