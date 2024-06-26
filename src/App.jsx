import React, { useEffect } from "react";
import { Navigation } from "@/common-ui/Navigation/Navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";
const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        dispatch(setUserData({ userData }));
      }
    });
    return unSubscribe;
  }, []);

  return <Navigation />;
};

export default App;
