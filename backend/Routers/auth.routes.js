import express from 'express';
import { login, logout } from '../controllers/login.controller.js';
import { isAuthenticated } from '../utils/isAuthenticate.js';

const router = express.Router();

// Login Route
router.post('/login', login);

router.post('/logout', logout);


// Example Protected Route
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You are authenticated!' });
});

export default router;
