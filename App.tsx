import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import VehicleTypeSelection from './pages/VehicleTypeSelection';
import VehicleProfileSetup from './pages/VehicleProfileSetup';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Garage from './pages/Garage';
import History from './pages/History';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<VehicleTypeSelection />} />
        <Route path="/setup-profile" element={<VehicleProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task-detail" element={<TaskDetail />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
