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
        // 1️⃣ Find food item by ID
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        console.log("🔥 Full image URL from DB:", food.image);

        // 2️⃣ Extract Cloudinary public ID
        const imageUrl = food.image;
        const urlParts = imageUrl.split('/');
        const fileNameWithExt = decodeURIComponent(urlParts.pop()); // Decode URL-encoded filenames
        const folder = urlParts[urlParts.length - 2]; // Extracts "food_images"

        // ✅ Remove ALL extensions (fixing `.jpeg.png` issue)
        const fileName = fileNameWithExt.replace(/\.(jpeg|jpg|png|gif|webp|svg|bmp|tiff|jfif)$/i, '');

        const publicId = `${folder}/${fileName}`;

        console.log("🛠 Final Cloudinary Public ID:", publicId);

        // 3️⃣ Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("🗑 Cloudinary Delete Response:", result);

        if (result.result !== "ok" && result.result !== "not found") {
            return res.json({ success: false, message: "Failed to delete from Cloudinary" });
        }

        // 4️⃣ Delete from Database
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food removed successfully!" });

    } catch (error) {
        console.error("❌ Error in removeFood:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




export {addFood, listFood, removeFood}