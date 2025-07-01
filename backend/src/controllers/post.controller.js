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


// enpoint to get all posts 
const getAllPosts = asyncHandler(async( req , res) =>{

    const posts = await Post
    .find()
    .sort({createdAt : -1})
    .populate({
        path:"author",
        select:"username , profileImg"
    })
    .populate({
        path:"comments", //posts pr jo comment h unhe populate kiyah 
        sort:{createdAt : -1},
        populate:{
            path:"author",
            select: "username , profileImg"
        }
    })

    if(!posts) {
        throw new apiError(404 , "post not found");
    }
    return res
    .status(200)
    .json(
        new apiResponse(200 , "all posts" , posts)
    )
    
})

// enpoint to get current user post 

const getLoggedInUserPosts = asyncHandler( async(req,res) =>{
    const userId = req.user?._id;
    if(!userId) {
        throw new apiError(401 , "unauthorized access");
    }

    const posts = await Post.find({author:userId})
    .sort({createdAt : -1})
    .populate({
        path:"author",
        select : "username , profileImg"
    })
    .populate({
        path:"comments", //posts pr jo comment h unhe populate kiyah 
        sort:{createdAt : -1},
        populate:{
            path:"author",
            select: "username , profileImg"
        }
    })

    if(!posts) {
        throw new apiError(404 , "error while fetching posts")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200 , "loggedIn user posts fetched succesfully" , posts)
    )
})












export {
    addnewPost,
    getAllPosts,
    getLoggedInUserPosts
}