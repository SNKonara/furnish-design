import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import Workspace from './components/Workspace.jsx'
import RoomTemplates from './components/RoomTemplates.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/templates" element={<RoomTemplates />} />
      </Routes>
    </BrowserRouter>
  )
}