import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home } from "pages/Home";
import { Dashboard } from "pages/Dashboard";
import { AddAndRemoveFriends } from "pages/AddAndRemoveFriends";
import { useAppSelector } from "store";
import { Header } from "common-ui/Header/Header";

const useGetFromAndPath = (defaultfrom: string) => {
  const location = useLocation();
  const { pathname } = location;
  const state = location.state || null;
  const { from } = state ?? { from: defaultfrom };
  return { from, pathname };
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useGetFromAndPath("/");
  const userDetails = useAppSelector((state) => state.userDetails);
  return userDetails.userData ? (
    children
  ) : (
    <Navigate state={{ from: pathname }} to="/" replace />
  );
};

const OnlyPublicRoute = ({ children }: { children: JSX.Element }) => {
  const { from } = useGetFromAndPath("/dashboard");
  const userDetails = useAppSelector((state) => state.userDetails);
  return userDetails.userData ? <Navigate to={from} replace /> : children;
};

export const Navigation = () => {
  const userDetails = useAppSelector((state) => state.userDetails);

  return (
    <>
      {userDetails && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <OnlyPublicRoute>
              <Home />
            </OnlyPublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-and-remove-friends"
          element={
            <PrivateRoute>
              <AddAndRemoveFriends />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};
