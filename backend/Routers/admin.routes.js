import express from 'express';
import { Participant, EventCoordinator, VenueIncharge, Admin } from '../models/Users.model.js';
import { isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();

const roles = {
    participant: Participant,
    event_coordinator: EventCoordinator,
    venue_incharge: VenueIncharge,
    admin: Admin,
};

// Get all users
router.get('/users', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    try {
        const allUsers = [];

        // Fetch users from all roles
        for (const role in roles) {
            const users = await roles[role].find({}, '-password');
            allUsers.push(...users.map((user) => ({ ...user._doc, role })));
        }

        res.status(200).json({ users: allUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change user role
router.put('/change-role/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Find and remove the user from their current role collection
        let user;
        for (const role in roles) {
            user = await roles[role].findByIdAndDelete(id);
            if (user) break;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the user to the new role collection
        const NewModel = roles[role];
        const newUser = new NewModel({
            ...user._doc,
            role, // Update the role
        });

        await newUser.save();
        res.status(200).json({ message: 'Role updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/delete-user/:id', isAuthenticated, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        let userDeleted = false;

        // Search and delete the user in all role collections
        for (const role in roles) {
            const user = await roles[role].findByIdAndDelete(id);
            if (user) {
                userDeleted = true;
                break;
            }
        }

        if (!userDeleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
