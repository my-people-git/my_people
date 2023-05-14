import React, { useEffect, useRef, useState } from "react";
import { auth } from "firebaseAuth/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useAppDispatch } from "store";
import { RecaptchaVerifier } from "firebase/auth";
import OTPInput from "otp-input-react";
import loader from "../../assests/loader.svg";
export const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);
  const recaptchaRef = useRef<HTMLElement | null>(null);
  const loginUser = () => {
    if (loading && phoneNumber.length !== 10) return;
    setLoading(true);
    if (!recaptchaRef.current || !verifier) return;
    verifier.verify();
    signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier)
      .then((confirmationResult) => {
        setLoading(false);
        //@ts-ignore
        window.confirmationResult = confirmationResult;
        setShowOTPScreen(true);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const VerifyOTP = () => {
    //@ts-ignore
    window.confirmationResult.confirm(OTP);
  };
  useEffect(() => {
    if (!recaptchaRef.current) return;
    const verifier = new RecaptchaVerifier(
      recaptchaRef.current,
      {
        size: "invisible",
      },
      auth
    );
    setVerifier(verifier);
    return () => {
      verifier.clear();
    };
  }, []);

  const submitDisabled = loading || phoneNumber.length !== 10;

  return (
    <>
      <div ref={recaptchaRef} className="hidden"></div>
      <div className="h-full p-4 flex flex-col">
        <h3 className="mt-32 text-3xl text-gray-300 font-medium">
          Stay bonded with your closest friends no matter where you are, thanks
          to <span className="text-green-500">My People</span>.
        </h3>
        <div className="flex flex-col mt-16 justify-center">
          {!showOTPScreen ? (
            <>
              <label>
                <span className="text-md text-gray-200">
                  Please Enter your Mobile number
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-7 left-2">🇮🇳</span>
                <input
                  className="bg-zinc-900 mt-2 border-2 border-gray-700 pt-4 pb-4 pl-8 w-full rounded text-gray-200"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  inputMode="numeric"
                  type="number"
                  pattern="[0-9]*"
                ></input>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <button
                  onClick={loginUser}
                  id="sign-in-button"
                  className="w-full relative flex items-center justify-center bg-green-500 rounded mt-2 p-4 text-lg font-medium disabled:bg-gray-800 disabled:text-gray-400"
                  disabled={submitDisabled}
                >
                  {loading ? (
                    <img src={loader} className="w-6" alt="loader" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <label>
                <span className="text-md text-gray-200">Please Enter OTP</span>
              </label>
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                inputStyles={{ width: "40px", height: "48px" }}
                inputClassName="bg-zinc-900 mt-2 border-2 border-gray-700 pt-4 pb-4 pl-1 w-full rounded text-gray-200 "
              />
              <div className="absolute bottom-2 left-2 right-2">
                <button
                  onClick={VerifyOTP}
                  id="sign-in-button"
                  disabled={OTP.length !== 6}
                  className="w-full bg-green-500 rounded mt-2 p-4 text-lg font-medium disabled:bg-gray-800 disabled:text-gray-400"
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
