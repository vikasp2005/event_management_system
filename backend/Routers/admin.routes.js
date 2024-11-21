import express from 'express';
import bcrypt from 'bcrypt';
import { create_user } from '../controllers/Admin.controllers/create-user.controller.js';
import {  get_users } from '../controllers/Admin.controllers/get-users.controller.js';
import { change_role } from '../controllers/Admin.controllers/change-role.controller.js';
import { delete_user } from '../controllers/Admin.controllers/delete-user.controller.js';
import { isAuthenticated, authorizeRole } from '../utils/isAuthenticate.js';

const router = express.Router();



// Create User
router.post('/create-user', isAuthenticated, authorizeRole('admin'), create_user);

// Get all users categorized by role
router.get('/users', isAuthenticated, authorizeRole('admin'), get_users);

// Change user role
router.put('/change-role/:id', isAuthenticated, authorizeRole('admin'), change_role);

// Delete user by role and ID
router.delete('/delete-user/:id', isAuthenticated, authorizeRole('admin'), delete_user);

export default router;
