import express from "express";
import path from 'path';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();


// Image Storage Engine

// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`)
//     }
// })

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(path.resolve(), "uploads"); // Ensures absolute path
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({storage:storage})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "food_images", // Cloudinary folder name
        format: async (req, file) => "png", // Convert all images to PNG
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage });

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)


export default foodRouter;