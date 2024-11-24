import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    symposium: { type: mongoose.Schema.Types.ObjectId, ref: 'Symposium', required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['technical', 'non_technical'], required: true },
    competitionType: { type: String, enum: ['solo', 'team'], required: true },
    poster: { type: String }, // URL or file path for the poster
    registrationForm: [{ fieldName: String, fieldType: String, required: Boolean }], // Custom form fields
    eligibilityCriteria: { type: String },
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
    maxParticipants: { type: Number },
    registeredParticipants: [
        {
            participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            participantData: mongoose.Schema.Types.Mixed // Custom data based on registrationForm
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Event Coordinator
});

export const Event = mongoose.model('Event', EventSchema);
