import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
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



// endpoint to like or dislike post 

const likeorDislikePost = asyncHandler( async(req , res) =>{

    const userId = req.user?._id;
    
    if(!userId) {
        throw new apiError(401 , "unauthorized access");
    }

    const postId = req.params.id;
    if(!postId) {
        throw new apiError(400 , "post id is required");
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new apiError(404 , "post not found");
    
    }

    let msg=""

    

    if(!post.likes.includes(userId)){
        post.likes.push(userId);
        msg="post liked successfully"
    }
    else {
        // post.updateOne({$addToSet:{likes:userId}})  --> this will only add unique likes 
        post.likes.pull(userId);
        msg="post unliked successfully"

    }
    await post.save({validateBeforeSave:false});
    return res
    .status(200)
    .json(
        new apiResponse(200 , msg , post)
    )
})


// endpoint to add a comment on post 
const addCommentOnPost = asyncHandler( async(req , res) => {

    const userId = req.user?._id;
    if(!userId) {
        throw new apiError(401 , "unauthorized access");
    }

    const postId = req.params.id;
    if(!postId) {
        throw new apiError(400 , "post id is required");
    }

    const post = await Post.findById(postId);
    if(!post) {
        throw new apiError(404 , "post not found");
    }

    const { text } = req.body;
    if(!text) {
        throw new apiError(400 , "text is required");
    }

    const comment = await Comment.create({
        text ,
        author:userId,
        post:postId

    })
    await comment.populate({
        path:"author",
        select:"username , profileImg"
    })

    if(!comment) {
        throw new apiError(500 , "error while adding comment")
    }

    post.comments.push(comment._id);
    await post.save({validateBeforeSave:false});
    return res
    .status(201)
    .json(
        new apiResponse(201 , "comment added successfully" , comment)
    )
})


// endpoint to get all comments on a post

const getAllComments = asyncHandler(async (req, res) => {

    const postId = req.params.postId;
    if(!postId){
        throw new apiError(400,"post id is required")
    }

    const comments = await Comment.find({post:postId})
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profileImg" });

    if (!comments || comments.length === 0) {
        throw new apiError(500, "Something went wrong while fetching comments");
    }

    return res
    .status(200)
    .json(new apiResponse(200,comments,"comments fetched successfully"))
})


// api to delete a post 

const deletePost = asyncHandler( async (req , res) => {

    const postId = req.params.postId;
    if(!postId) {
        throw new apiError(400 , "post id is required");

    }

    const author = req.user?._id;
    if(!author) {
        throw new apiError(401 , "unauthorized access");
    }
    const post = await Post.findById(postId);
    if(!post) {
        throw new apiError(404 , "post not found");
    }

    if(post.author.toString() !== author.toString()) {
        throw new apiError(401 , "unauthorized access");
    }

    await Post.findByIdAndDelete(postId);

    // delete post from the user also 

    let user = await User.findById(author);
    if(!user) {
        throw new apiError(404 , "user not found");
    }

    user.posts = user.posts.filter( id => id.toString() !== postId.toString()); 
    await user.save({validateBeforeSave:false});

    // deleting associated comments also 

    await Comment.deleteMany({post:postId});

    return res
    .status(200)
    .json(
        new apiResponse(200 , {} ,  "post deleted successfully")
    )

})

export {
    addnewPost,
    getAllPosts,
    getLoggedInUserPosts,
    likeorDislikePost,
    addCommentOnPost,
    getAllComments,
    deletePost
    
}