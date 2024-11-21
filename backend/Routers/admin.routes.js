import express from 'express';
import bcrypt from 'bcrypt';
import { Participant, EventCoordinator, VenueIncharge, Admin } from '../models/Users.model.js';
import { isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();

const roles = {
    participant: Participant,
    event_coordinator: EventCoordinator,
    venue_incharge: VenueIncharge,
    admin: Admin,
};

// Create User
router.post('/create-user', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        rollNo,
        dept,
        yearOfStudy,
        passOutYear,
        section,
        clubName,
        venueName,
    } = req.body;

    // Validate common fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    try {
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const Model = roles[role];
        const existingUser = await Model.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUserData = { name, email, password: hashedPassword };

        // Role-specific fields
        if (role === 'participant') {
            if (!rollNo || !dept || !yearOfStudy || !passOutYear || !section) {
                return res.status(400).json({ message: 'All participant fields are required.' });
            }
            newUserData = { ...newUserData, rollNo, dept, yearOfStudy, passOutYear, section };
        } else if (role === 'event_coordinator') {
            if (!clubName) {
                return res.status(400).json({ message: 'Club name is required for event coordinator.' });
            }
            newUserData = { ...newUserData, clubName };
        } else if (role === 'venue_incharge') {
            if (!dept || !venueName) {
                return res.status(400).json({ message: 'Department and venue name are required for venue in-charge.' });
            }
            newUserData = { ...newUserData, dept, venueName };
        }

        const newUser = new Model(newUserData);
        await newUser.save();

        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all users categorized by role
router.get('/users', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const categorizedUsers = {};

        for (const role in roles) {
            const users = await roles[role].find({}, '-password'); // Exclude password
            categorizedUsers[role] = users.map((user) => ({ ...user._doc }));
        }

        res.status(200).json({ users: categorizedUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Change user role
router.put('/change-role/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { newRole, currentRole } = req.body;

    try {
        if (!roles[currentRole] || !roles[newRole]) {
            return res.status(400).json({ message: 'Invalid current role or new role.' });
        }

        const currentModel = roles[currentRole];
        const user = await currentModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newModel = roles[newRole];
        const newUser = new newModel({
            ...user._doc,
            role: newRole,
        });

        await newUser.save();

        res.status(200).json({ message: 'Role updated successfully!', user: { ...newUser._doc } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete user by role and ID
router.delete('/delete-user/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Expecting role in the request body

    try {
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const Model = roles[role];
        const user = await Model.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

export default router;
