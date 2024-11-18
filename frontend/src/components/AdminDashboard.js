import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/users');
                const result = await response.json();
                setUsers(result.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        const response = await fetch(`http://localhost:5000/api/admin/change-role/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        });

        if (response.ok) {
            setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)));
            alert('Role updated successfully!');
        } else {
            alert('Error updating role');
        }
    };

    // Handle delete user
    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const response = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter((user) => user._id !== userId));
                alert('User deleted successfully!');
            } else {
                alert('Error deleting user');
            }
        }
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (!users || users.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                >
                                    <option value="participant">Participant</option>
                                    <option value="event_coordinator">Event Coordinator</option>
                                    <option value="venue_incharge">Venue In-Charge</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
