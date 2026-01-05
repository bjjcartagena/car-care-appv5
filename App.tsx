import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./screens/Dashboard";
import Garage from "./screens/Garage";
import TaskDetail from "./screens/TaskDetail";
import VehicleTypeSelection from "./screens/VehicleTypeSelection";
import VehicleProfileSetup from "./screens/VehicleProfileSetup";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VehicleTypeSelection />} />
      <Route path="/setup-profile" element={<VehicleProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/garage" element={<Garage />} />
      <Route path="/task-detail" element={<TaskDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
