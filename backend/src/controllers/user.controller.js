import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


// helper function to generata access and refresh token 

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new apiError(404,"user not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ValidateBeforeSave:false});

        return {accessToken,refreshToken};
    } catch (error) {
         throw new apiError(500,"something went wrong while generating access and refresh token");
    }
}

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

// endpoint to login a user 

const loginUser = asyncHandler( async ( req, res) => {

    const { email , password } = req.body;

    if(!email && !password) {
        throw new apiError(400 , "email and password are required");
    }

    const loggedInUser = await User.findOne( {
        $or : [ { email } , { password  } ]
    })

    if(!loggedInUser) {
        throw new apiError(400 , "user not found");
    }

    const isPasswordCorrect = await loggedInUser.isPasswordCorrect(password);

    if(!isPasswordCorrect) {
        throw new apiError(400 , "password is incorrect");
    }

    const {accessToken , refreshToken} = await generateAccessToken(loggedInUser._id);

    const user = await User.findById(loggedInUser._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true

    }
    return res
    .status(201)
    .cookie("refreshToken", refreshToken,options)
    .cookie("accessToken", accessToken,options)
    .json(
        new apiResponse(201 , 
            {
                user,
                accessToken,
                refreshToken
            }
          , "user logged in successfully")
    )
})


export {
    registerUser,
    loginUser

}