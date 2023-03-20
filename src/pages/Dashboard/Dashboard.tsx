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
      className="bg-blue-400 m-2 p-2 rounded-full w-24 h-24 flex flex-wrap content-center justify-center"
      onClick={handleAvatarClick}
    >
      <h3 className="text-4xl">
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
    <div
      onClick={handleAddButtonCLicked}
      className="m-2 p-2 border-dashed border-2 border-sky-500 rounded-full w-24 h-24 flex flex-wrap content-center justify-center"
    >
      <AddCircleOutlineIcon fontSize="large" />
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
      <Grid container>
        {userData?.friends?.map(
          ({ name, phoneNumber, deleted }) =>
            !deleted && (
              <Grid
                item
                key={phoneNumber}
                container
                xs={6}
                justifyContent="center"
                alignItems="center"
              >
                <Avatar name={name} tel={phoneNumber} />
              </Grid>
            )
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
