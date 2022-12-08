import React from "react";
import { Navigation } from "@/common-ui/Navigation/Navigation";
// import { auth } from "./firebaseAuth/firebase";
const App = () => {
  const logoutUser = () => {
    auth
      .signOut()
      .then(() => {
        //set user to null
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   const unSubscribe = auth.onAuthStateChanged((user) => {
  //     console.log(user);
  //   });
  //   return unSubscribe;
  // }, []);

  return <Navigation></Navigation>;
};

export default App;
