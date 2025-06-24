import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config( {
    path: "./.env"
})

connectDB()
.then(() => console.log("mongo db connected successfully 🥳"))
.catch( (err) => console.log("mongo db connection error " , err))