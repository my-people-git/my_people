export type StatusType = "idle" | "loading" | "success" | "error";

export type UserDataType = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
};

export type UserDetailsInitialType = {
  userData: null | UserDataType;
  requests: UserDataType[];
  frineds: UserDataType[] & { channelId: string };
  status: StatusType;
};
