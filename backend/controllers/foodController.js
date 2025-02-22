import foodModel from  "../models/foodModel.js";
import cloudinary from 'cloudinary';

import fs from 'fs';

//add food item

// const addFood = async (req,res) => {

//     let image_filename = `${req.file.filename}`;

//     const food = new foodModel({
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//         category: req.body.category,
//         image: image_filename
//     })
//     try{
//         await food.save();
//         res.json({success:true, message:"Food Added"})
//     }catch(error){
//         console.log(error);
//         res.json({success:false, message:"Error this"});
//     }

// }

const addFood = async (req, res) => {
    try {
        console.log("Uploaded File:", req.file); // Debugging

        if (!req.file || !req.file.path) {
            return res.status(400).json({ success: false, message: "Image upload failed" });
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.path, // 🔹 Store Cloudinary URL instead of local file
        });

        await food.save();
        res.json({ success: true, message: "Food Added", data: food });

    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// all food list
const listFood = async (req,res) => {

    try{
        const foods = await foodModel.find({});
        res.json({success:true, data:foods})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
    

}

//remove food item

const removeFood = async (req, res) => {
    try {
        // Find food item by ID
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Extract Cloudinary public ID
        const imageUrl = food.image;
        console.log("Image URL from DB:", imageUrl); // Debug log 1

        // Extracting public ID properly
        const parts = imageUrl.split('/');
        const fileName = parts.pop().split('.')[0]; // Extract file name without extension
        const publicId = `food_images/${fileName}`;  // Ensure the correct folder path

        console.log(" Extracted public ID:", publicId); // Debug log 2

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(" Cloudinary Delete Response:", result); // Debug log 3

        if (result.result !== "ok") {
            return res.json({ success: false, message: "Failed to delete from Cloudinary" });
        }

        // Delete from database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed" });

    } catch (error) {
        console.error(" Error in removeFood:", error); // Debug log 4
        res.json({ success: false, message: "Error" });
    }
};




export {addFood, listFood, removeFood}