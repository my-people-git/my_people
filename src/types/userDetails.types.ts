export type StatusType = "idle" | "loading" | "success" | "error";
export type Friend = {
  id: string;
  phoneNumber: string;
  deleted: boolean;
  name: string;
};

export type UserDetailsInitialType = {
  userData: null | {
    uid: string;
    displayName: string | null;
    email: string | null;
    displayPicture: string | null;
    friends: Friend[];
  };
  status: StatusType;
};
