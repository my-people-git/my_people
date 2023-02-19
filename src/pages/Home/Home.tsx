import React, { useEffect, useState } from "react";
import { auth } from "firebaseAuth/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "store";
import { setUserData, setUserStatus } from "features/auth.slice";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { RecaptchaVerifier } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const config = {
  apiKey: "AIzaSyAeue-AsYu76MMQlTOM-KlbYBlusW9c1FM",
  authDomain: "myproject-1234.firebaseapp.com",
  // ...
};
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/signedIn",
  // We will display Google and Facebook as auth providers.
};

export const Home = () => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState("+917888859607");
  const [OTP, setOTP] = useState("");
  const [showOTPScreen, setShowOTPScreen] = useState(false);

  const loginUser = () => {
    // dispatch(setUserStatus("loading"));
    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );
    appVerifier.verify();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // user in with confirmationResult.confirm(code).
        //@ts-ignore
        window.confirmationResult = confirmationResult;
        setShowOTPScreen(true);
      })
      .catch((error) => {});
  };

  const VerifyOTP = () => {
    //@ts-ignore
    window.confirmationResult.confirm(OTP);
  };

  return (
    <>
      <div id="recaptcha-container" className="hidden"></div>
      <Stack p={8} height="100vh" gap={4}>
        <Typography mt={16} textAlign="center" variant="h2">
          My People
        </Typography>
        {!showOTPScreen && (
          <>
            <Stack justifyContent="center" direction="row" gap={2}>
              <TextField
                label="Mobile Number"
                variant="filled"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              ></TextField>
              <Button
                onClick={loginUser}
                id="sign-in-button"
                variant="contained"
              >
                Send OTP
              </Button>
            </Stack>
          </>
        )}
        {showOTPScreen && (
          <>
            <Stack justifyContent="center" direction="row" gap={2}>
              <TextField
                label="OTP"
                variant="filled"
                type="text"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
              ></TextField>
              <Button
                onClick={VerifyOTP}
                id="sign-in-button"
                variant="contained"
              >
                Send OTP
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
};
