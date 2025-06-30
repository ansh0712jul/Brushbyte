import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const verifyJwt = asyncHandler( async(req, res, next) => {

    try {

        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        
        if(!token) {
            throw new apiError(401 , "unauthorized access");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken._id);

        if(!user){
            throw new apiError(401 , "Invalid Token");
        }

        req.user = user;
        next();
        
    } catch (error) {
        throw new apiError(401 , error.message || "unauthorized access");
    }
})

export default verifyJwt;