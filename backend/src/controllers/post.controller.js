import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import handleImageUpload from "../utils/imageHandler.js";







// endpoint to add new post 
const addnewPost = asyncHandler(async(req , res) => {

    const { caption } = req.body;
    const image = req.file // gives complete file object 
    const authorId = req.user?._id;

    if(!image) {
        throw new apiError(400 , "image is required");
    }

    const optimisedImageUrl = await handleImageUpload(image);
    if(!optimisedImageUrl) {
        throw new apiError(400 , "image optimisation error");
    }

    const cloudinaryResponse = await uploadOnCloudinary(optimisedImageUrl);
    if(!cloudinaryResponse) {
        throw new apiError(400 , "cloudinary upload error");
    }

    const post = await Post.create({
        caption ,
        image : cloudinaryResponse.url,
        author : authorId
    })
    // push the new post to the post array of the user

    const user = await User.findById(authorId);
    if(!user) {
        throw new apiError(404 , "user not found");
    }
    user.posts.push(post._id);
    await user.save({validateBeforeSave : false});


    // get the auhthor details of the post 
    await post.populate({
        path:"author",
        select:"-password -refreshToken"
    }) 

    return res
    .status(201)
    .json(
        new apiResponse(201 , "post added successfully" , post)
    )

    
})

export {
    addnewPost
}