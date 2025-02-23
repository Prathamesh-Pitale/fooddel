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

const getPublicIdFromUrl = (imageUrl) => {
    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/'); // Extract path parts
        let fileNameWithExt = decodeURIComponent(pathParts.pop()); // Decode %20 (spaces)
        const folder = pathParts.pop(); // Extract folder (e.g., "food_images")

        // Remove all extensions (.png, .jpeg, .jpg, etc.)
        const fileName = fileNameWithExt.replace(/\.[^.]+$/, '').replace(/\.[^.]+$/, '');

        return `${folder}/${fileName}`;
    } catch (error) {
        console.error("❌ Error extracting public ID:", error);
        return null;
    }
};

cconst removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        console.log("🔥 Full image URL from DB:", food.image);

        // Extract correct Cloudinary Public ID
        const publicId = getPublicIdFromUrl(food.image);
        if (!publicId) {
            return res.json({ success: false, message: "Invalid image URL" });
        }

        console.log("🛠 Extracted Public ID for Deletion:", publicId);

        // Verify if the image exists in Cloudinary before deletion
        try {
            await cloudinary.api.resource(publicId);
            console.log("✅ Image exists in Cloudinary, proceeding with deletion.");
        } catch (checkError) {
            console.log("⚠️ Image not found in Cloudinary:", checkError.message);
            return res.json({ success: false, message: "Image not found in Cloudinary" });
        }

        // Delete from Cloudinary
        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        console.log("🗑 Cloudinary Delete Response:", deleteResponse);

        if (deleteResponse.result !== "ok") {
            return res.json({ success: false, message: "Failed to delete from Cloudinary" });
        }

        // Delete from database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed successfully" });

    } catch (error) {
        console.error("❌ Error in removeFood:", error);
        res.json({ success: false, message: "Error deleting food" });
    }
};





export {addFood, listFood, removeFood}