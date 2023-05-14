import React, { useEffect, useState } from "react";
import { Navigation } from "@/common-ui/Navigation/Navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";
import loader from "./assests/loader.svg";

const App = () => {
  const dispatch = useAppDispatch();
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (user) {
        const userData = {
          uid: user.uid,
        };
        dispatch(setUserData({ userData }));
      }
    });
    return unSubscribe;
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen relative">
      {authLoading ? (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
          <img src={loader} className="w-24 h-24" alt="loader" />
        </div>
      ) : (
        <Navigation />
      )}
    </div>
  );
};

export default App;
