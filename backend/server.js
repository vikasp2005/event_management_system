import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, configureSession } from './db/connectdb.js';
import AdminRouter from './Routers/admin.routes.js';
import authRouter from './Routers/auth.routes.js'; // Import auth routes

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Configure session middleware
configureSession(app);


app.use('/api/admin', AdminRouter);
app.use('/auth', authRouter); // Use auth routes

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
