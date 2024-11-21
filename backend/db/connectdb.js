import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';

export const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        // Retry logic (optional)
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};


export const configureSession = (app) => {
    const MongoStore = connectMongo.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    });

    app.use(
        session({
            genid: () => uuidv4(), // Generate a unique session ID
            secret: process.env.SESSION_SECRET || 'yourSecretKey',
            resave: false,
            saveUninitialized: false,
            store: MongoStore,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        })
    );

    console.log('Session management enabled with UUID.');
};

