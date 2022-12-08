import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BetterRoute } from "./BetterRoute";
import { Dashboard } from "pages/Dashboard/Dashboard";

export const Navigation = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <BetterRoute
          path="/dashboard"
          type="PROTECTED"
          element={<Dashboard />}
        /> */}
      </Routes>
    </>
  );
};
