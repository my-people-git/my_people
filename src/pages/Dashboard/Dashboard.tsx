import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Header } from "common-ui/Header/Header";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

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
    navigate("/add-and-remove-friends");
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
  useEffect(() => {
    const result = getContacts();
    setContacts(result);
  }, []);
  return (
    <>
      <Grid container>
        {contacts?.map(({ name, tel }) => (
          <Grid container xs={6} justifyContent="center" alignItems="center">
            <Avatar name={name} tel={tel} />
          </Grid>
        ))}
        <Grid
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
