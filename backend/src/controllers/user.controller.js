import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// endpoint to create register a user 
const registerUser = asyncHandler( async( req , res ) => {

    const { username , email , password } = req.body;

    // check validation 
    if(
        [

        username, email , password
        ].some( (ele) => ele?.trim() === "")
    ){
        throw new apiError(400 , "all fields are required ");
    }

    // checking for existing user

    const existedUser = await User.findOne(
        {

            $or: [ { username } , { email } ]
        }
    )

    if(existedUser) {
        throw new apiError(400 , "user already exists");
    }

    const image = req.file?.path;
    if(!image) {
        throw new apiError(400 , "image is required");
    }

    // upload image on cloudinary
    const ImgUrl = await uploadOnCloudinary(image);

    if(!ImgUrl) {
        throw new apiError(400 , "image upload failed");
    }

    const user = await User.create( {

        username,
        email,
        password,
        profileImg : ImgUrl.url
    })

    await user.save();

    // removing password and refresh token from response 
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new apiError(400 , "something went wrong while creating a user");
    }

    res.status(201)
       .json(
         new apiResponse(201 , createdUser, "user created successfully"  )
       )


})

export {
    registerUser
}