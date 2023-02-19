export type StatusType = "idle" | "loading" | "success" | "error";
export type Friend = {
  phoneNumber: string;
  deleted: boolean;
  name: string;
};

export type UserDetailsInitialType = {
  userData: null | {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    friends: Friend[];
  };
  status: StatusType;
};
