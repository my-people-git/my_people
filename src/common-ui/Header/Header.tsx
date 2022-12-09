import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";

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
    <>
      <button onClick={logoutUser}>logout</button>
    </>
  );
};
