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
        // Find food by ID
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Extract public ID from Cloudinary URL
        const imageUrl = food.image;
        // const parts = imageUrl.split('/');
        // const fileName = parts.pop().split('.')[0]; // Extract unique ID
        // const folder = parts[parts.length - 1]; // Extract folder name
        // const publicId = `${folder}/${fileName}`;
        const publicId = imageUrl
            .split('/')
            .slice(-2) // Take the last 2 parts (folder + filename)
            .join('/') // Join them to form a proper public_id
            .split('.')[0]; // Remove the file extension
            console.log("Image URL from DB:", imageUrl);
            console.log("Extracted public ID:", publicId);

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Delete Response:", result);

        if (result.result !== "ok") {
            return res.json({ success: false, message: "Failed to delete from Cloudinary" });
        }

        // Delete from DB
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food removed successfully" });
    } catch (error) {
        console.error("Error deleting food:", error);
        res.json({ success: false, message: "Error deleting food" });
    }
};



export {addFood, listFood, removeFood}