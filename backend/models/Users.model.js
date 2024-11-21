import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rollNo: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        dept: { type: String, required: true },
        password: { type: String, required: true },
        yearOfStudy: { type: Number, required: true },
        passOutYear: { type: Number, required: true },
        section: { type: String, required: true },
    },
    { timestamps: true }
);

export const Participant = mongoose.model('Participant', participantSchema);



const eventCoordinatorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        clubName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export const EventCoordinator = mongoose.model('EventCoordinator', eventCoordinatorSchema);



const venueInchargeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dept: { type: String, required: true },
        venueName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export const VenueIncharge = mongoose.model('VenueIncharge', venueInchargeSchema);

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);



