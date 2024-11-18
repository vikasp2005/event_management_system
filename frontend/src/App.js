import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
    return (
      
        <Router>
            <Routes>
                <Route path="/" element={<RoleSelection />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/participant/dashboard" element={<h1>Participant Dashboard</h1>} />
                <Route path="/event_coordinator/dashboard" element={<h1>Event Coordinator Dashboard</h1>} />
                <Route path="/venue_incharge/dashboard" element={<h1>Venue In-Charge Dashboard</h1>} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
