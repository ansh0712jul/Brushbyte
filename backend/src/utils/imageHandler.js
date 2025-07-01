
import sharp from "sharp";
import path from "path";


const handleImageUpload = async(file) =>{

    try {
        if(!file){
            return null;
        }

        const inputPath = file.path;
        
        const outputFileName = `processed-${file.originalname.split('.')[0]}.jpeg`;
        const outputPath = path.join("public", "temp", outputFileName);

        await sharp(inputPath)
        .resize({
            width: 600,
            height: 600,
            fit: 'inside'
        })
        .toFormat('jpeg' , {
            quality: 90
        })
        .toFile(outputPath);

         return outputPath;    
        
    } catch (error) {
        console.log("image optimisation error " , error);
    }
}

export default handleImageUpload