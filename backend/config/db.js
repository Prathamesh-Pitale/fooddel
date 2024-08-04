import mongoose from "mongoose";
import mongodb from "mongodb";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://pratham:25636719@cluster0.9zhc9hy.mongodb.net/food-del').then(()=> {
        console.log("DB CONNECTED!");
    });
} 