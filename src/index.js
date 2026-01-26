import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("URI:", process.env.MONGODB_URI);


// import mongoose from "mongoose";
import {DB_NAME} from './constants.js'
import connectDB from "./db/index.js";
import {app} from "./app.js"

connectDB()//connectDB returns promise
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`server is running on port: ${process.env.PORT}`);  
    })
})
.catch((err)=>{
    console.log('MONGOdb CONNECTION FAILED' , err)
})









/* import express from "express";
const app = express();

;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error' , (error)=>{
            console.log('ERROR:' , error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is listening on porrt ${process.env.PORT}`);
            
        })
    } catch (err) {
        console.error('error' , err)
    }
})() */