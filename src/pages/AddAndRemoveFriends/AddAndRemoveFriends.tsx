import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store";
import { Friend } from "types/userDetails.types";
import { addFriend, removeFriend } from "features/auth.slice";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, eventLogger } from "firebaseAuth/firebase";
import { Contacts, GetContactsResult } from "@capacitor-community/contacts";

const retrieveListOfContacts = async () => {
  const projection = {
    // Specify which fields should be retrieved.
    name: true,
    phones: true,
    postalAddresses: true,
  };
  try {
    const result = await Contacts.getContacts({
      projection,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const Title = () => {
  return (
    <>
      <h3 className="text-lg mb-4 text-green-500 font-medium">
        Please add close Connections (Max 9 ) from Your contacts with whom you
        want to stay in touch
      </h3>
    </>
  );
};
type Contact = {
  name: string | null | undefined;
  phoneNumber: string | null | undefined;
  id: string;
};

const getListwithAddedFlag = (
  friends: Friend[] | null | undefined,
  contacts: GetContactsResult | null
) => {
  const formatedContact: Contact[] =
    contacts?.contacts.map((contact) => ({
      name: contact.name?.display,
      phoneNumber: contact.phones
        ?.find(() => true)
        ?.number?.split(" ")
        .join(""),
      id: contact.contactId,
    })) || [];
  return formatedContact.map((contact) => {
    const friend = friends?.find(
      (friend) => friend.phoneNumber === contact.phoneNumber
    );
    if (friend) {
      return { ...contact, alreadyAdded: !friend.deleted, id: friend.id };
    }
    return { ...contact, alreadyAdded: false };
  });
};

export const AddAndRemoveFriends = () => {
  const userDetails = useAppSelector((state) => state.userDetails);
  const dispatch = useAppDispatch();
  const [contactsList, setContactsList] = useState<GetContactsResult | null>(
    null
  );
  const [search, setSearch] = useState("");
  const contactsWithFlag = getListwithAddedFlag(
    userDetails.userData?.friends,
    contactsList
  );
  const handleAddFriendClick = async (friend: Contact) => {
    if (userDetails.userData && friend.phoneNumber && friend.name) {
      const { phoneNumber, name, id } = friend;
      eventLogger("my_people_updated", {
        prev_count: userDetails.userData?.friends?.length,
        type: "added",
        contactName: name,
        contactNumber: phoneNumber,
      });
      const uid = userDetails.userData.uid || "";
      const friendsRef = doc(db, "users", uid, "friends", phoneNumber);
      await setDoc(friendsRef, { ...friend });
      dispatch(addFriend({ phoneNumber, name, id, deleted: false }));
    }
  };

  const handleRemoveFriendClick = async (id: string) => {
    if (userDetails.userData) {
      eventLogger("my_people_updated", {
        prev_count: userDetails.userData.friends.length,
        type: "removed",
      });
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

  useEffect(() => {
    (async () => {
      const result = await retrieveListOfContacts();
      if (result) {
        setContactsList(result);
      }
    })();
  }, []);
  const filteredContacts = search
    ? contactsWithFlag.filter((contact) => contact.name?.includes(search))
    : contactsWithFlag;
  return (
    <div className="p-4">
      <Title></Title>
      <input
        className="bg-zinc-900 border-2 border-gray-700 pt-4 pb-4 pl-4 w-full rounded text-gray-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      ></input>
      {filteredContacts.map(
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
                onClick={() =>
                  phoneNumber && handleRemoveFriendClick(phoneNumber)
                }
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
