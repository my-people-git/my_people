import React, { useEffect } from "react";
import { Navigation } from "common-ui/Navigation/Navigation";
import { useAppDispatch } from "store";
import { setUserData } from "features/auth.slice";
import { usePersistUser } from "hooks/PersistUserData";

const App = () => {
  const dispatch = useAppDispatch();
  const handleSetUserData = (userData) => dispatch(setUserData({ userData }));
  usePersistUser(handleSetUserData);

  return (
    <div className="box-border">
      <Navigation />
    </div>
  );
};

export default App;
