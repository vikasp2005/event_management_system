import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'participant',
        rollNo: '',
        dept: '',
        yearOfStudy: '',
        passOutYear: '',
        section: '',
        clubName: '',
        venueName: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/users', {
                    withCredentials: true, // Include session cookie
                });
                setUsers(response.data.users || {});
            } catch (error) {
                console.error('Error fetching users:', error);
                alert(error.response?.data?.message || 'Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (id, currentRole, newRole) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/change-role/${id}`,
                { currentRole, newRole },
                { withCredentials: true }
            );
            alert('Role updated successfully!');
            window.location.reload(); // Refresh the user list
        } catch (error) {
            console.error('Error updating role:', error);
            alert(error.response?.data?.message || 'Error updating role');
        }
    };

    const handleDelete = async (id, role) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
                    data: { role },
                    withCredentials: true,
                });
                alert('User deleted successfully!');
                window.location.reload(); // Refresh the user list
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.message || 'Error deleting user');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/admin/create-user',
                formData,
                { withCredentials: true }
            );
            const newUser = response.data.user;
            setUsers((prev) => ({
                ...prev,
                [formData.role]: [...(prev[formData.role] || []), newUser],
            }));
            alert('User created successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'participant',
                rollNo: '',
                dept: '',
                yearOfStudy: '',
                passOutYear: '',
                section: '',
                clubName: '',
                venueName: '',
            });
        } catch (error) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.message || 'Error creating user');
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* Create User Form */}
            <div className="add-user-form">
                <h2>Create User</h2>
                <form onSubmit={handleCreateUser}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <select name="role" value={formData.role} onChange={handleInputChange} required>
                        <option value="participant">Participant</option>
                        <option value="event_coordinator">Event Coordinator</option>
                        <option value="venue_incharge">Venue In-Charge</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* Role-Specific Fields */}
                    {formData.role === 'participant' && (
                        <>
                            <input
                                type="text"
                                name="rollNo"
                                placeholder="Roll Number"
                                value={formData.rollNo}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="dept"
                                placeholder="Department"
                                value={formData.dept}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="yearOfStudy"
                                placeholder="Year of Study"
                                value={formData.yearOfStudy}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="passOutYear"
                                placeholder="Pass Out Year"
                                value={formData.passOutYear}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="section"
                                placeholder="Section"
                                value={formData.section}
                                onChange={handleInputChange}
                            />
                        </>
                    )}

                    {formData.role === 'event_coordinator' && (
                        <input
                            type="text"
                            name="clubName"
                            placeholder="Club Name"
                            value={formData.clubName}
                            onChange={handleInputChange}
                        />
                    )}

                    {formData.role === 'venue_incharge' && (
                        <>
                            <input
                                type="text"
                                name="dept"
                                placeholder="Department"
                                value={formData.dept}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="venueName"
                                placeholder="Venue Name"
                                value={formData.venueName}
                                onChange={handleInputChange}
                            />
                        </>
                    )}
                    <button type="submit">Create User</button>
                </form>
            </div>

            {/* Existing Users Table */}
            <div className="existing-users">
                <h2>Existing Users</h2>
                {Object.keys(users).length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    Object.keys(users).map((role) => (
                        <div key={role}>
                            <h3>{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users[role].map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <select
                                                    value={role}
                                                    onChange={(e) =>
                                                        handleRoleChange(user._id, role, e.target.value)
                                                    }
                                                >
                                                    {Object.keys(users).map((r) => (
                                                        <option key={r} value={r}>
                                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleDelete(user._id, role)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
