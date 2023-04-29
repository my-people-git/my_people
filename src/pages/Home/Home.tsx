import React, { useEffect, useState } from "react";
import { auth } from "firebaseAuth/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "store";
import { setUserData, setUserStatus } from "features/auth.slice";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { RecaptchaVerifier } from "firebase/auth";
import OTPInput, { ResendOTP } from "otp-input-react";

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
      <div className="h-full p-4 flex flex-col">
        <h3 className="mt-32 text-3xl text-green-500 font-medium">
          Stay bonded with your closest friends no matter where you are, thanks
          to My people.
        </h3>
        <div className="flex flex-col mt-16 justify-center">
          {!showOTPScreen && (
            <>
              <label>
                <span className="text-md text-gray-200">
                  Please Enter your Mobile number
                </span>
              </label>
              <input
                className="bg-zinc-900 mt-2 border-2 border-gray-700 pt-4 pb-4 pl-2 w-full rounded text-gray-200"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
              ></input>
              <div className="absolute bottom-2 left-2 right-2">
                <button
                  onClick={loginUser}
                  id="sign-in-button"
                  className="w-full bg-green-500 rounded mt-2 p-4 text-lg font-bold"
                >
                  Send OTP
                </button>
              </div>
            </>
          )}
          {showOTPScreen && (
            <>
              <label>
                <span className="text-md text-gray-200">Please Enter OTP</span>
              </label>
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={4}
                otpType="number"
                disabled={false}
                inputStyles={{ width: "40px", height: "48px" }}
                inputClassName="w-24 h-24 bg-zinc-900 mt-2 border-2 border-gray-700 pt-4 pb-4 pl-2 w-full rounded text-gray-200"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <button
                  onClick={VerifyOTP}
                  id="sign-in-button"
                  className="w-full bg-green-500 rounded mt-2 p-4 text-lg font-bold"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
