export type StatusType = "idle" | "loading" | "success" | "error";

export type UserDetailsInitialType = {
  userData: null | {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  status: StatusType;
};
