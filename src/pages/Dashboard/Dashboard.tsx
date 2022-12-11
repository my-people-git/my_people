import React, { useState } from "react";
import { Header } from "common-ui/Header/Header";
import { VideoCall } from "components/VideoCall";

export const Dashboard = () => {
  const [startCall, setStartCall] = useState<boolean>(false);

  return (
    <>
      <Header />
      {startCall && <VideoCall setStartCall={setStartCall} />}
      <div className="grid place-content-center">
        {!startCall && (
          <button
            className="p-2 bg-blue-100 m-2"
            onClick={() => setStartCall(true)}
          >
            Start Call
          </button>
        )}
      </div>
    </>
  );
};
