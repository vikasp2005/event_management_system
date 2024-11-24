import express from 'express';
import { Event } from '../models/Event.model.js';

const router = express.Router();


router.get('/symposiums', async (req, res) => {
    try {
        const symposiums = await Symposium.find(); // Assuming you have a Symposium model
        res.json(symposiums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching symposiums.', error });
    }
});


router.get('/symposiums/:id/events', async (req, res) => {
    try {
        const { id } = req.params;
        const events = await Event.find({ symposium: id }); // Assuming symposium ID is stored in the event
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events for symposium.', error });
    }
});



router.get('/participant/:id/registered-events', async (req, res) => {
    try {
        const { id } = req.params;
        const events = await Event.find({ participants: id });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching registered events.', error });
    }
});





export default router; // Export the router to be used in the main application
