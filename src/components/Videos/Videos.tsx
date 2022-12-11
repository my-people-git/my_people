import React from "react";

import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { AgoraVideoPlayer } from "agora-rtc-react";

export const Videos = ({
  users,
  tracks,
}: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  return (
    <div>
      <div className="p-2" id="videos">
        <AgoraVideoPlayer
          className="w-full h-96 rounded-xl overflow-hidden"
          videoTrack={tracks[1]}
        />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer
                  className="w-full h-96 rounded-xl overflow-hidden"
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
              );
            } else return null;
          })}
      </div>
    </div>
  );
};
