import React, { useState, useEffect } from "react";
import { ClientConfig, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};
//@ts-ignore
const appID = import.meta.env.VITE_AGORA_APP_ID;
//@ts-ignore
const token = import.meta.env.VITE_AGORA_TOKEN;

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export const useInitialVideoCall = ({
  channelName,
  uid,
}: {
  channelName: string;
  uid: string | undefined;
}) => {
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const [usersTracks, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  console.log({ token });
  const mute = async (type: "audio" | "video") => {
    if (!tracks) {
      return;
    }
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    if (tracks) {
      tracks[0].close();
      tracks[1].close();
    }
  };

  useEffect(() => {
    let init = async (channelName: string) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      if (uid) {
        await client.join(appID, channelName, token, uid);
      }
      if (tracks) await client.publish([tracks[0], tracks[1]]);
    };

    if (ready && tracks) {
      init(channelName);
    }
    return () => client.removeAllListeners();
  }, [channelName, client, ready, tracks]);

  return {
    currentUserTracks: tracks,
    trackState,
    usersTracks,
    mute,
    leaveChannel,
  };
};
