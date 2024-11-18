import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';

export const connectDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export const configureSession = (app) => {
    const MongoStore = connectMongo.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    });

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'yourSecretKey', // Replace with a strong secret
            resave: false,
            saveUninitialized: false,
            store: MongoStore,
            cookie: {
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        })
    );

    console.log('Session management enabled');
};
