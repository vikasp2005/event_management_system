import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    incharge: { type: String, required: true },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['Seminar Hall', 'Computer Lab'], required: true },
    department: { type: String, required: true },
});

export const Venue = mongoose.model('Venue', venueSchema);
