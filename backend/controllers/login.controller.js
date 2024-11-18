import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Participant,  EventCoordinator,  VenueIncharge , Admin } from "../models/Users.model.js";

const roles = {
    participant: Participant,
    event_coordinator: EventCoordinator,
    venue_incharge: VenueIncharge,
    admin: Admin,
};

// Unified Login Function
export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Validate role
        if (!roles[role]) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Find user in the corresponding model
        const Model = roles[role];
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        // Create session token
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
