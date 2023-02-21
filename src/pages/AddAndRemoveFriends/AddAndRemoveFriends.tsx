import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { Friend } from "types/userDetails.types";
import { addFriend, removeFriend } from "features/auth.slice";
import { uuidv4 } from "@firebase/util";

const Title = () => {
  return (
    <>
      <Typography variant="h6" m={1}>
        Please add close Connections (Max 9 ) from Your contacts with whom you
        want to stay in touch
      </Typography>
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
      return { ...contacts, alreadyAdded: true, id: friend.id };
    } else {
      return { ...contacts, alreadyAdded: false };
    }
  });
};

export const AddAndRemoveFriends = () => {
  const userDetails = useAppSelector((state) => state.userDetails);
  const dispatch = useAppDispatch();
  const ContactsWithFlag = userDetails.userData
    ? getListwithAddedFlag(userDetails.userData?.friends, contactsList)
    : [];

  const handleAddFriendClick = (friend: Contact) => {
    dispatch(addFriend({ ...friend, deleted: false }));
  };

  const handleRemoveFriendClick = (id: string) => {
    dispatch(removeFriend(id));
  };

  return (
    <>
      <Title></Title>
      {ContactsWithFlag.map(({ name, phoneNumber, alreadyAdded, id }) => (
        <Stack
          direction="row"
          className="bg-gray-200"
          p={1}
          borderRadius={1}
          m={1}
          justifyContent="space-between"
          alignItems="center"
          key={id}
        >
          <Typography variant="body1">{name}</Typography>
          {!alreadyAdded && (
            <Button
              variant="outlined"
              onClick={() => handleAddFriendClick({ name, phoneNumber, id })}
            >
              Add
            </Button>
          )}
          {alreadyAdded && (
            <Button
              variant="outlined"
              onClick={() => handleRemoveFriendClick(id)}
              color="error"
            >
              Remove
            </Button>
          )}
        </Stack>
      ))}
    </>
  );
};
