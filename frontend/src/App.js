import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminManageDepartments from './components/AdminManageDepartments';
import ManageVenue from './components/ManageVenue';
import Navbar from './components/Navbar';
import EventDashboard from './components/EventDashboard';
import ManageEvents from './components/ManageEvents';
import ManageSymposiums from './components/ManageSymposiums';
import EditSymposium from './components/EditSymposium';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';

import axios from 'axios';

const App = () => {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/get-role', {
                    withCredentials: true, // Include session cookie
                });
                setRole(response.data.role);
            } catch (err) {
                console.error('Error fetching role:', err);
                setError(err.response?.data?.message || 'Error fetching role');
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Router>
            {/* Show Navbar conditionally based on location */}
            <NavbarWrapper role={role} />
            <Routes>
                <Route path="/" element={<RoleSelection />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/participant/dashboard" element={<h1>Participant Dashboard</h1>} />
                <Route path="/event_coordinator/dashboard" element={<ManageSymposiums />} />

                <Route path="/event_coordinator/create-symposium" element={<EventDashboard />} />
                <Route path="/event_coordinator/edit-symposium/:id" element={<EditSymposium />} />


                <Route path="/event_coordinator/symposium/:symposiumId/events" element={<ManageEvents />} />
                <Route path="/event_coordinator/create-event/:symposiumId" element={<CreateEvent />} />
                <Route path="/event_coordinator/edit-event/:eventId" element={<EditEvent />} />


                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manage-departments" element={<AdminManageDepartments />} />
                <Route path="/admin/manage-venue" element={<ManageVenue />} />


                
            </Routes>
        </Router>
    );
};

// NavbarWrapper to conditionally display the Navbar
const NavbarWrapper = ({ role }) => {
    const location = useLocation();

    // Hide Navbar on specific routes
    const hideNavbarRoutes = ['/login/:role'];
    const shouldHideNavbar = hideNavbarRoutes.some((route) =>
        location.pathname.startsWith(route.replace(':role', ''))
    );

    return !shouldHideNavbar ? <Navbar role={role} /> : null;
};

export default App;
