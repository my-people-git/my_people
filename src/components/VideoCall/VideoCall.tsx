import React from "react";
import { useAppSelector } from "store";
import { Videos } from "components/Videos";
import { useInitialVideoCall } from "hooks/useInitialVideoCall";

type VideoCallProps = {
  setStartCall: (param: boolean) => void;
  channelName: string;
};

export const VideoCall = ({ setStartCall, channelName }: VideoCallProps) => {
  const { userData } = useAppSelector((state) => state.userDetails);
  const { usersTracks, currentUserTracks, leaveChannel, mute, trackState } =
    useInitialVideoCall({
      channelName,
      uid: userData?.uid,
    });
  const handleLeaveCall = () => {
    leaveChannel();
    setStartCall(false);
  };
  return (
    <div className="p-2">
      {currentUserTracks && (
        <Videos tracks={currentUserTracks} users={usersTracks} />
      )}
      <button className="p-2 bg-red-500 m-2" onClick={handleLeaveCall}>
        Leave
      </button>
      <button className="p-2 bg-red-500 m-2" onClick={() => mute("audio")}>
        {trackState.audio ? "Disable" : "UN-Disable"} Audio
      </button>
      <button className="p-2 bg-red-500 m-2" onClick={() => mute("video")}>
        {trackState.video ? "Disable" : "UN-Disable"} video
      </button>
    </div>
  );
};
