import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { Friend } from "types/userDetails.types";
import { addFriend, removeFriend } from "features/auth.slice";
import { uuidv4 } from "@firebase/util";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseAuth/firebase";

const Title = () => {
  return (
    <>
      <h3 className="text-lg mb-10 text-green-500 font-medium">
        Please add close Connections (Max 9 ) from Your contacts with whom you
        want to stay in touch
      </h3>
    </>
  );
};
type Contact = {
  name: string;
  phoneNumber: string;
  id: string;
};
const contactsList: Contact[] = [
  { name: "Rijul Nirwal", phoneNumber: "9999988888", id: uuidv4() },
  { name: "Anas Nirwal", phoneNumber: "9999988882", id: uuidv4() },
  { name: "Quaz Nirwal", phoneNumber: "9999988883", id: uuidv4() },
  { name: "Shivam Nirwal", phoneNumber: "9999988884", id: uuidv4() },
];

const getListwithAddedFlag = (friends: Friend[], contacts: Contact[]) => {
  return contacts.map((contacts) => {
    const friend = friends.find(
      (friend) => friend.phoneNumber === contacts.phoneNumber
    );
    if (friend) {
      return { ...contacts, alreadyAdded: !friend.deleted, id: friend.id };
    } else {
      return { ...contacts, alreadyAdded: false };
    }
  });
};

export const AddAndRemoveFriends = () => {
  const userDetails = useAppSelector((state) => state.userDetails);
  const dispatch = useAppDispatch();
  const ContactsWithFlag = userDetails.userData?.friends
    ? getListwithAddedFlag(userDetails.userData.friends, contactsList)
    : [];
  const handleAddFriendClick = async (friend: Contact) => {
    if (userDetails.userData) {
      const friendsRef = doc(
        db,
        "users",
        userDetails.userData.uid,
        "friends",
        friend.phoneNumber
      );
      // addDoc(userRef);
      await setDoc(friendsRef, { ...friend });
      dispatch(addFriend({ ...friend, deleted: false }));
    }
  };

  const handleRemoveFriendClick = async (id: string) => {
    if (userDetails.userData) {
      const friendRef = doc(
        db,
        "users",
        userDetails.userData.uid,
        "friends",
        id
      );
      await updateDoc(friendRef, { deleted: true });
      dispatch(removeFriend(id));
    }
  };
  return (
    <div className="p-4">
      <Title></Title>
      {ContactsWithFlag.map(
        //@ts-ignore
        ({ name, phoneNumber, alreadyAdded, id, deleted }) => (
          <div
            className="w-full flex items-center justify-between border-solid border-b border-gray-500 drop-shadow-md p-2 mb-2"
            key={id}
          >
            <h3 className="text-lg text-white">{name}</h3>
            {!alreadyAdded && (
              <button
                className="bg-green-500 p-2 pl-4 pr-4 rounded font-medium"
                onClick={() => handleAddFriendClick({ name, phoneNumber, id })}
              >
                Add
              </button>
            )}
            {alreadyAdded && (
              <button
                className="border border-solid border-green-500 text-green-500 p-2 pl-4 pr-4 rounded font-medium"
                onClick={() => handleRemoveFriendClick(phoneNumber)}
                color="error"
              >
                Remove
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};
