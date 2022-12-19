import React from "react";
import { auth, firestore, provider } from "firebaseAuth/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData, setUserStatus } from "features/auth.slice";
import { doc, setDoc } from "firebase/firestore";

export const Home = () => {
  const dispatch = useAppDispatch();

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
          uid: result.user.uid,
        };
        setDoc(
          doc(firestore, "users", userData.uid),
          { ...userData },
          { merge: true }
        );
        dispatch(setUserData({ userData, status: "success", requests: [] }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      className="relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={loginUser}
    >
      Login
    </button>
  );
};
