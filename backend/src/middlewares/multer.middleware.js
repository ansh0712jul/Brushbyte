import multer from "multer";

//configuring multer disk storage 
const storage = multer.diskStorage({

    // set the destination directory for for uploaded files 
    destination: function (req, file, cb) {
      cb(null, "./public/temp") // specify the destination directory 
    },

    // Define the filename for uploaded files
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  
// Create a multer instance with the configured storage
const upload = multer({
    storage
})

export default upload