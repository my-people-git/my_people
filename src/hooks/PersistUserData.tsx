import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserDataType } from "types/userDetails.types";

export const usePersistUser = (
  handleSetUserData: (params: UserDataType) => void
) => {
  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        };
        handleSetUserData(userData);
      }
    });
    return unSubscribe;
  }, []);
};
