import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type AvatarProps = {
  onClick: () => void;
  size: "sm" | "lg";
};

const sizeNumberObj = {
  lg: 24,
  sm: 10,
};

const Avatar = ({ onClick, size }: AvatarProps) => {
  return (
    <div
      className={`w-${sizeNumberObj[size]} h-${sizeNumberObj[size]} bg-blue-600 rounded-full p-2 m-2`}
      onClick={onClick}
    >
      GD
    </div>
  );
};

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      <Avatar size="sm" onClick={logoutUser} />
    </header>
  );
};
