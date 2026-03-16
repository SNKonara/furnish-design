import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Catalog from './components/Catalog.jsx'
import Workspace from './components/Workspace.jsx'
import RoomTemplates from './components/RoomTemplates.jsx'
import Profile from './components/Profile.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/templates" element={<RoomTemplates />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
