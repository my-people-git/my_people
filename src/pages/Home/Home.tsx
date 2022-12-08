import React, { useEffect } from "react";
import { auth, provider } from "firebaseAuth/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "store";
import { setUserData, setUserStatus } from "features/auth.slice";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.userDetails);
  const navigator = useNavigate();

  const loginUser = async () => {
    dispatch(setUserStatus("loading"));
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const userData = {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        dispatch(setUserData({ userData, status: "success" }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userDetails.status === "success") {
      navigator("dashboard");
    }
  }, [userDetails]);

  return (
    <h1>
      <button
        className="relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={loginUser}
      >
        Login
      </button>
    </h1>
  );
};
