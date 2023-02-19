import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "store";
import { Friend } from "types/userDetails.types";

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
};
const contactsList: Contact[] = [
  { name: "Rijul Nirwal", phoneNumber: "9999988888" },
  { name: "Anas Nirwal", phoneNumber: "9999988882" },
  { name: "Quaz Nirwal", phoneNumber: "9999988883" },
  { name: "Shivam Nirwal", phoneNumber: "9999988884" },
];

const getListwithAddedFlag = (friends: Friend[], contacts: Contact[]) => {
  return contacts.map((contacts) => {
    if (friends.find((friend) => friend.phoneNumber === contacts.phoneNumber)) {
      return { ...contacts, alreadyAdded: true };
    } else {
      return { ...contacts, alreadyAdded: false };
    }
  });
};

export const AddAndRemoveFriends = () => {
  const userDetails = useAppSelector((state) => state.userDetails);

  const ContactsWithFlag = userDetails.userData
    ? getListwithAddedFlag(userDetails.userData?.friends, contactsList)
    : [];

  const addFriend = (friend: Contact) => {};

  return (
    <>
      <Title></Title>
      {ContactsWithFlag.map(({ name, phoneNumber, alreadyAdded }) => (
        <Stack
          direction="row"
          className="bg-gray-200"
          p={1}
          borderRadius={1}
          m={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1">{name}</Typography>
          {!alreadyAdded && <Button variant="outlined">Add</Button>}
          {alreadyAdded && (
            <Button variant="outlined" color="error">
              Remove
            </Button>
          )}
        </Stack>
      ))}
    </>
  );
};
