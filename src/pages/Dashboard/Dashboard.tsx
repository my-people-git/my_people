import React, { useEffect, useState } from "react";
import { Header } from "common-ui/Header/Header";
import { VideoCall } from "components/VideoCall";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "firebaseAuth/firebase";
import { UserDataType } from "types/userDetails.types";
import { useAppSelector } from "store";
import { useDispatch } from "react-redux";
import { setFriendsData, setRequestsData } from "features/auth.slice";

type UserProps = UserDataType & {
  handleSendFriendRequest?: ({ uid }: { uid: string }) => void;
  handleAcceptFriendRequest?: (user: UserDataType) => void;
};

const User = ({
  photoURL,
  uid,
  displayName,
  email,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
}: UserProps) => {
  return (
    <div>
      {photoURL && <img src={photoURL} />}
      <h1>{displayName}</h1>
      {handleSendFriendRequest && (
        <button onClick={() => handleSendFriendRequest({ uid })}>
          Add Friend
        </button>
      )}
      {handleAcceptFriendRequest && (
        <button
          onClick={() =>
            handleAcceptFriendRequest({ photoURL, uid, displayName, email })
          }
        >
          Add Friend
        </button>
      )}
    </div>
  );
};

const SearchUsers = () => {
  const { userData } = useAppSelector((state) => state.userDetails);
  const [searchText, setSearchText] = useState<string>("");
  const [searchUsers, setSearchUsers] = useState<UserDataType[]>([]);
  const handleSearchClick = async () => {
    if (searchText) {
      const q = query(
        collection(firestore, "users"),
        where("email", "==", searchText)
      );
      const querySnapshot = await getDocs<UserDataType>(q);
      let users: UserDataType[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(searchUsers);
      setSearchUsers(users);
    }
  };

  const handleSendFriendRequest = async ({ uid }: { uid: string }) => {
    if (userData) {
      const userRef = collection(firestore, "users", `${uid}/requests`);
      await addDoc(userRef, userData);
    }
  };

  return (
    <>
      <input
        value={searchText}
        className="border"
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearchClick}>Search</button>
      <div>
        {searchUsers.map((userData) => (
          <User
            {...userData}
            handleSendFriendRequest={handleSendFriendRequest}
          />
        ))}
      </div>
    </>
  );
};

const Requests = () => {
  const { requests, userData } = useAppSelector((state) => state.userDetails);

  const handleAcceptFriendRequest = async (user: UserDataType) => {
    if (userData) {
      const currentUserFriendsRef = doc(
        firestore,
        "users",
        `${userData.uid}/friends/${user.uid}`
      );
      const friendedUserFriendsRef = doc(
        firestore,
        "users",
        `${user.uid}/friends/${userData.uid}`
      );
      await setDoc(currentUserFriendsRef, user, { merge: true });
      await setDoc(friendedUserFriendsRef, userData, { merge: true });
    }
  };
  return (
    <div className="">
      <h3 className="text-xl">Request</h3>
      {requests.map((request) => (
        <User
          {...request}
          key={request.uid}
          handleAcceptFriendRequest={handleAcceptFriendRequest}
        />
      ))}
    </div>
  );
};

const Friends = () => {
  const { frineds } = useAppSelector((state) => state.userDetails);

  return (
    <div className="">
      <h3 className="text-xl">Friends</h3>
      {frineds.map((frined) => (
        <User {...frined} key={frined.uid} />
      ))}
    </div>
  );
};

export const Dashboard = () => {
  const [startCall, setStartCall] = useState<boolean>(false);
  const { userData, requests } = useAppSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (userData) {
        const requestsRef = collection(
          firestore,
          "users",
          `${userData.uid}/requests`
        );
        const friendsRef = collection(
          firestore,
          "users",
          `${userData.uid}/friends`
        );
        const requestsSanpShot = await getDocs(requestsRef);
        const friendsSanpShot = await getDocs(friendsRef);
        const requestsData: UserDataType[] = [];
        const friendsData: UserDataType[] = [];
        requestsSanpShot.forEach((doc) => {
          //@ts-ignore
          requestsData.push(doc.data());
        });
        friendsSanpShot.forEach((doc) => {
          //@ts-ignore
          friendsData.push(doc.data());
        });
        dispatch(setRequestsData(requestsData));
        dispatch(setFriendsData(friendsData));
      }
    })();
  }, [userData?.uid]);
  return (
    <>
      <Header />
      <SearchUsers />
      <Requests />
      <Friends />
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
