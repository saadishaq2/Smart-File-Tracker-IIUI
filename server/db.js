import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const dbUrl = process.env.DBURL
export const connectDB = () => {
    mongoose.connect(dbUrl, {
        minPoolSize: 50, useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.set('autoIndex', true);
    mongoose.connection
        .once('open', () => { console.log("connection open"); })
        .on('error', err => {
            console.log(err);
            console.log('DB is not connected');
            throw err;
        })
}