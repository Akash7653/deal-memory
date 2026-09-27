import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DealOverview from './pages/DealOverview';
import MemoryTimeline from './pages/MemoryTimeline';
import MeetingPrep from './pages/MeetingPrep';
import AiAgent from './pages/AiAgent';
import AddInteraction from './pages/AddInteraction';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="deal" element={<DealOverview />} />
          <Route path="timeline" element={<MemoryTimeline />} />
          <Route path="meeting-prep" element={<MeetingPrep />} />
          <Route path="agent" element={<AiAgent />} />
          <Route path="add-interaction" element={<AddInteraction />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
