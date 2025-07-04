// src/pages/dashboard/Dashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "../../components/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Dashboard;
