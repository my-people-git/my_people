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
      <button
        className="bg-red-500 rounded-md p-2 block m-2"
        onClick={logoutUser}
      >
        logout
      </button>
    </>
  );
};
