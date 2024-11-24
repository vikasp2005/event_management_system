import mongoose from "mongoose";

const SymposiumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['inter_departmental', 'inter_college', 'intra_college'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Technical and Non-Technical Events
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true }, // Venue for the symposium
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Event Coordinator
});

export const Symposium = mongoose.model('Symposium', SymposiumSchema);
