import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
import cloudinary from "./cloudinary.js";


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "answers",
        format: async (req, file) => "webp",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    }
});

const upload = multer({storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null,true);
        }else{
            cb(new Error("Only images are allowed"),false);
        }
    }
});

export default upload;