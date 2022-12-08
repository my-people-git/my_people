import React from "react";
import { auth, provider } from "firebaseAuth/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Home = () => {
  const loginUser = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        const user = result.user;
        console.log(user, token);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <h1>
      <button onClick={loginUser}>click me to login</button>
    </h1>
  );
};
