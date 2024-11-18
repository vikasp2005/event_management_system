import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import  eventRouter  from './Routers/event.routes.js';
import { connectDB } from './db/connectdb.js';

const app =express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const port = process.env.PORT;

app.use('/event',eventRouter);

app.get('/',(req,res)=>{
    res.send('Hello World');
})


// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message
    });
});


app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on th port ${port}`);
})