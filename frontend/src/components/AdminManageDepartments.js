import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminManageDepartments.css';

const AdminManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ name: '', duration: '' });
    const [newSection, setNewSection] = useState({ departmentId: '', sectionName: '' });

    // Fetch all departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/departments', {
                withCredentials: true, // Include session cookie
            });
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
            alert('Error fetching departments.');
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Create a new department
    const handleCreateDepartment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/admin/create-department', newDepartment, {
                withCredentials: true, // Include session cookie
            });
            alert('Department created successfully!');
            setNewDepartment({ name: '', duration: '' });
            fetchDepartments();
        } catch (error) {
            console.error('Error creating department:', error);
            alert('Error creating department.');
        }
    };

    // Add a new section
    const handleAddSection = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:5000/api/admin/add-section/${newSection.departmentId}`,
                { sectionName: newSection.sectionName }, {
                    withCredentials: true, // Include session cookie
                }
            );
            alert('Section added successfully!');
            setNewSection({ departmentId: '', sectionName: '' });
            fetchDepartments();
        } catch (error) {
            console.error('Error adding section:', error);
            alert('Error adding section.');
        }
    };


    // Delete a Department
    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this Department?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-department/${departmentId}`, {
                    withCredentials: true, // Include session cookie
                });
                alert('Department deleted successfully!');
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting Department:', error);
                alert('Error deleting Department.');
            }
        }
    };

    // Delete a section
    const handleDeleteSection = async (departmentId, sectionId) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-section/${departmentId}/${sectionId}`, {
                    withCredentials: true, // Include session cookie
                });
                alert('Section deleted successfully!');
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting section:', error);
                alert('Error deleting section.');
            }
        }
    };

    return (
        <div className="admin-manage-departments">
            <h1>Manage Departments</h1>

            {/* Create Department */}
            <form onSubmit={handleCreateDepartment} className="create-department-form">
                <h2>Create Department</h2>
                <input
                    type="text"
                    placeholder="Department Name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Course Duration (years)"
                    value={newDepartment.duration}
                    onChange={(e) => setNewDepartment({ ...newDepartment, duration: e.target.value })}
                    required
                />
                <button type="submit">Create</button>
            </form>

            {/* Department List */}
            <div className="departments-list">
                {departments.map((dept) => (
                    <div key={dept._id} className="department-card">
                        <h3>{dept.name} ({dept.duration} years)</h3>
                        <button onClick={() => handleDeleteDepartment(dept._id)}>
                                        Delete
                                    </button>

                        {/* Sections */}
                        <ul>
                            {dept.sections.map((section) => (
                                <li key={section._id}>
                                    {section.name}
                                    <button onClick={() => handleDeleteSection(dept._id, section._id)}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Add Section */}
                        <form onSubmit={handleAddSection}>
                            <input
                                type="text"
                                placeholder="New Section Name"
                                value={newSection.sectionName}
                                onChange={(e) => setNewSection({ departmentId: dept._id, sectionName: e.target.value })}
                                required
                            />
                            <button type="submit">Add Section</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminManageDepartments;
