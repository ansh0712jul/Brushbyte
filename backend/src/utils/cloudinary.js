import { v2 as cloudinary } from "cloudinary"
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    
})

const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if(!localFilePath) return null;

        // upload the file on cloudinary
        const result = await cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        });
        
        // file has been uploaded on cloudinary
        console.log("file has been uploaded on cloudinary" , result.url);

        // remove file from local if uploaded succesfully 
        fs.unlinkSync(localFilePath);
        return result;

    } catch (error) {

        console.log("cloudinary upload error " , error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadOnCloudinary