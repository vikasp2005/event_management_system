import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageVenue = () => {
    const [venues, setVenues] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        incharge: '',
        capacity: '',
        type: 'Seminar Hall',
        department: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch venues
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/venues', { withCredentials: true });
                setVenues(response.data.venues);
            } catch (err) {
                console.error('Failed to fetch venues:', err);
            }
        };

        fetchVenues();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add a new venue
    const handleAddVenue = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/add-venue', formData, { withCredentials: true });
            setVenues([...venues, response.data.venue]);
            setSuccess('Venue added successfully!');
            setError('');
            setFormData({ name: '', incharge: '', capacity: '', type: 'Seminar Hall', department: '' });
        } catch (err) {
            setError('Failed to add venue. Please try again.');
            setSuccess('');
        }
    };

    // Delete a venue
    const handleDeleteVenue = async (id) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-venue/${id}`, { withCredentials: true });
                setVenues(venues.filter((venue) => venue._id !== id));
                setSuccess('Venue deleted successfully!');
                setError('');
            } catch (err) {
                setError('Failed to delete venue.');
                setSuccess('');
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Venue</h1>

            {/* Add Venue Form */}
            <form onSubmit={handleAddVenue} className="mb-6 space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Venue Name"
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="incharge"
                    value={formData.incharge}
                    onChange={handleInputChange}
                    placeholder="In-Charge Name"
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Capacity"
                    className="border p-2 w-full"
                    required
                />
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                >
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                </select>
                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="border p-2 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Venue
                </button>
            </form>

            {/* Venue List */}
            <h2 className="text-xl font-bold mb-4">Existing Venues</h2>
            {venues.length === 0 ? (
                <p>No venues available.</p>
            ) : (
                <ul className="space-y-4">
                    {venues.map((venue) => (
                        <li key={venue._id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{venue.name}</h3>
                                <p>In-Charge: {venue.incharge}</p>
                                <p>Capacity: {venue.capacity}</p>
                                <p>Type: {venue.type}</p>
                                <p>Department: {venue.department}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteVenue(venue._id)}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageVenue;
