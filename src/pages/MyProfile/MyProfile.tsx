import React, { useState, useRef, useEffect } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseAuth/firebase";
import { useAppDispatch, useAppSelector } from "store";
import { updateName } from "features/auth.slice";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { uuidv4 } from "@firebase/util";

const storage = getStorage();
//@ts-ignore
const Avatar = () => {
  const { userData } = useAppSelector((state) => state.userDetails);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const fileUploaderRef = useRef<HTMLInputElement | null>(null);
  const fileClicked = () => {
    if (fileUploaderRef.current) {
      fileUploaderRef.current.click();
    }
  };

  const handleFileChanged: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const objectUrl = URL.createObjectURL(selectedFile);
      setFileURL(objectUrl);
      setFile(selectedFile);
    }
  };
  const handleUploadDP = async () => {
    //@ts-ignore
    if (file && userData) {
      const storageRef = ref(storage, uuidv4());
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log({ snapshot });
        const displayPicture = snapshot.metadata.fullPath;
        const userRef = doc(db, "users", userData?.uid);
        updateDoc(userRef, { displayPicture }).then(() => {
          setFile(null);
        });
      });
    }
  };

  return (
    <div className="relative">
      <div className="bg-blue-400 m-2 p-2 rounded-full w-24 h-24 flex flex-wrap content-center justify-center overflow-hidden object-fit">
        <img
          src={
            fileURL || userData?.displayPicture
              ? `https://firebasestorage.googleapis.com/v0/b/close-friends-aa982.appspot.com/o/${userData.displayPicture}?alt=media&token=a83e0c8e-99ca-450e-a839-b80462c2e0fb`
              : ""
          }
          alt=""
        />
      </div>
      <div
        className="w-10 h-10 bg-blue-400 text-white rounded-full absolute bottom-0 right-0 flex flex-wrap content-center justify-center"
        onClick={!fileURL ? fileClicked : handleUploadDP}
      >
        {fileURL ? "((" : <CameraAltIcon color="inherit" />}
      </div>
      <input
        type="file"
        className="hidden"
        onChange={handleFileChanged}
        ref={fileUploaderRef}
      />
    </div>
  );
};

export const MyProfile = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { userData } = useAppSelector((state) => state.userDetails);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>(userData?.displayName || "");

  const showEditClick = () => {
    setIsEdit(true);
  };
  const hideEditClick = () => {
    setIsEdit(false);
  };

  const handleSaveClick = async () => {
    if (userData) {
      if (name) {
        const userRef = doc(db, "users", userData?.uid);
        updateDoc(userRef, { displayName: name }).then(() => {
          dispatch(updateName(name));
          setIsEdit(false);
        });
      }
    }
  };

  return (
    <>
      <Stack p={2}>
        <Stack className="relative" alignItems="center">
          <Avatar />
        </Stack>
        <Stack mt={4}>
          <TextField
            variant="standard"
            label="Name"
            value={name}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEdit}
          />
        </Stack>
        {isEdit && (
          <Stack direction="row" mt={2} gap={2}>
            <Button
              fullWidth
              color="error"
              variant="outlined"
              onClick={hideEditClick}
            >
              Canel
            </Button>
            <Button fullWidth variant="contained" onClick={handleSaveClick}>
              Save
            </Button>
          </Stack>
        )}
        {!isEdit && (
          <Stack mt={2}>
            <Button variant="contained" onClick={showEditClick}>
              Edit
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};
