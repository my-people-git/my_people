import React from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";
type BetterRouteProps = {
  path: string;
  type: "PROTECTED" | "PUBLIC-ONLY";
  element: JSX.Element;
};

export const BetterRoute = ({ path, type, element }: BetterRouteProps) => {
  const location = useLocation();
  const { pathname } = location;
  const state = location.state || null;
  const { from } = state ?? { from: "/" };
  const userDetails = useAppSelector((state) => state.userDetails);

  switch (type) {
    case "PROTECTED":
      //@ts-ignore
      return userDetails.userData ? (
        <Route path={path} element={element} />
      ) : (
        <Navigate state={{ from: pathname }} replace to="/login" />
      );
    case "PUBLIC-ONLY":
      //@ts-ignore
      return !userDetails.userData ? (
        <Route path={path} element={element} />
      ) : (
        <Navigate replace to={from} />
      );
    default:
      return <Route path={path} element={element} />;
  }
};
