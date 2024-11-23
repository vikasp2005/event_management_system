import mongoose from 'mongoose';


const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    duration: { type: Number, required: true }, // Course duration in years
    sections: [sectionSchema], // Array of sections within the department
});

export const Department = mongoose.model('Department', departmentSchema);
