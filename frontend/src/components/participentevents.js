import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SymposiumEvents = () => {
    const { symposiumid } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/participant/symposiums/${symposiumid}/events`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [symposiumid]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Events in Symposium</h1>
            <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                    <div key={event._id} className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">{event.name}</h2>
                        <p>{event.description}</p>
                        <p>Type: {event.type}</p>
                        <p>
                            Date: {new Date(event.date).toLocaleDateString()} at{' '}
                            {new Date(event.date).toLocaleTimeString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SymposiumEvents;
