import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { useAppSelector } from "store";
import { db } from "firebaseAuth/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "features/auth.slice";
type ContactType = {
  name: string;
  tel: string;
};

function getContacts() {
  return [
    { name: "Gagandeep Singh", tel: "7888859607" },
    { name: "J Singh", tel: "+917888659607" },
  ];
}

const Avatar = ({ name, tel }: ContactType) => {
  const [firstname, lastname] = name.split(" ");
  const handleAvatarClick = () => {
    window.open(`https://api.whatsapp.com/send/?phone=${tel}`);
  };
  return (
    <div
      className="bg-green-500 m-2 p-2 rounded-full w-10 h-10 flex flex-wrap content-center justify-center"
      onClick={handleAvatarClick}
    >
      <h3 className="text-md">
        {lastname
          ? `${firstname[0] + lastname[0]}`
          : `${firstname.slice(0, 2)}`}
      </h3>
    </div>
  );
};

const AddFriendButton = () => {
  const navigate = useNavigate();
  const handleAddButtonCLicked = () => {
    navigate("/add_and_remove_friends");
  };
  return (
    <button
      onClick={handleAddButtonCLicked}
      className="w-full border border-solid border-green-500 text-green-500 rounded mt-2 p-4 text-lg "
    >
      Add Friends
    </button>
  );
};

const Card = ({ name, tel }: ContactType) => {
  return (
    <div className="w-full flex items-center rounded-md bg-zinc-900 border-solid border border-gray-500 drop-shadow-md">
      <Avatar name={name} tel={tel} />
      <h3 className="text-lg text-white">{name}</h3>
    </div>
  );
};

export const Dashboard = () => {
  const [contacts, setContacts] = useState<null | ContactType[]>();
  const userData = useAppSelector((state) => state.userDetails.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    const result = getContacts();
    setContacts(result);
    (async () => {
      if (userData) {
        const userRef = doc(db, "users", userData.uid);
        const friendsRef = collection(db, "users", userData.uid, "friends");
        const userSnapShot = await getDoc(userRef);
        const friendsSnapshot = await getDocs(friendsRef);
        const data = userSnapShot.data();
        //@ts-ignore
        const friends = [];
        friendsSnapshot.forEach((doc) => {
          const data = doc.data();
          const friend = { ...data, id: doc.id };
          friends.push(friend);
        });
        console.log(data);
        dispatch(
          setUserData({
            //@ts-ignore
            userData: {
              uid: userData.uid,
              ...data,
              //@ts-ignore
              friends,
            },
          })
        );
      }
    })();
  }, []);
  return (
    <>
      <Grid container gap={1} p={2}>
        <h3 className="text-3xl mb-8 text-green-500 font-medium">
          Welcome to My People{" "}
        </h3>
        {userData?.friends?.map(
          ({ name, phoneNumber, deleted }) =>
            !deleted && <Card name={name} tel={phoneNumber} />
        )}
        <Grid
          item
          container
          xs={contacts?.length && contacts.length % 2 === 0 ? 12 : 6}
          justifyContent="center"
          alignItems="center"
        >
          <AddFriendButton />
        </Grid>
      </Grid>
    </>
  );
};
