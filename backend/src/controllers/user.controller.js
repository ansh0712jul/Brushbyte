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
         new apiResponse(201 , "user created successfully", createdUser   )
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
            "user logged in successfully",
            {
                user,
                accessToken,
                refreshToken
            }
          )
    )
})



// endpoint to logout a user 

const logoutUser = asyncHandler( async(req , res) => {

    if(!req.user){
        throw new apiError(401 , "unauthorized access");
    
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : ""
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .cookie("refreshToken" , "" , options)
    .cookie("accessToken" , "" , options)
    .json(
        new apiResponse(200 ,  "user logged out successfully" , {})
    )
    
})

// endpoint to getCurrentuser 

const getCurrentUser = asyncHandler( async(req , res) => {

    if(!req.user) {
        throw new apiError(401 , "unauthorized access");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200 , "user fetched successfully" , req.user )
    )
})

// end point to get the profile 

const getProfile = asyncHandler( async(req , res) =>{

    const userId = req.params.id;
    if(!userId) {
        throw new apiError(400, "user id is required");
    }

   const user = await User.findById(userId)
    .populate({ 
        path: 'posts', 
        match: {}, // optional filter
        options: { sort: { createdAt: -1 } }
    })
    .populate({ 
        path: 'bookmarks', 
        match: {} 
    })
    .select('-password -refreshToken');

    user.posts = user.posts.filter(post => post != null);
    user.bookmarks = user.bookmarks.filter(post => post != null);

    await user.save({validateBeforeSave : false});

    if(!user) {
        throw new apiError(404 , "user not found");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200 , user , "user profile fetched successfully")
    )
})

// endpoint to update user 

const updateUser = asyncHandler( async (req , res ) =>{

    if(!req.user) {
        throw new apiError(401 , "Unacuthorized access");
    }
    const userId = req.user._id;
    const { username , bio } = req.body;
    let profileImg = req.file?.path;

    let imageUrl = "";

    if(profileImg) {

        // upload image on cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(profileImg);
        imageUrl = cloudinaryResponse.url;
    }

    // find user and update it
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                username,
                bio,
                profileImg: imageUrl
            }
        },
        {
            new : true
        }
    ).select("-password ");

    if(!updatedUser) {
        throw new apiError(404 , "user not found");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200 , updatedUser , "user updated successfully")
    )  
})

// endpoint to change password 

const changeCurrentPassword = asyncHandler( async(req , res) =>{
    const { oldPassword , newPassword } = req.body;

    if(!oldPassword && !newPassword){
        throw new apiError(400 , "old password and new password are required");
   
    }

    const user = User.findById(req.user?._id);

    if(!user) {
        throw new apiError(404 , "user not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) {
        throw new apiError(400 , "old password is incorrect");
    }

    // here no need to hash password coz i add my custom method to UserSchema which if hashing pass if password is modified

    user.password = newPassword;
    await user.save({ validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new apiResponse(200 , {} , "password changed successfully")
    )
})


// endpoint to follow or unfollow a user 

const followOrUnfollowUser = asyncHandler( async(req,res) =>{

    const userId = req.user?._id;
    if(!userId) {
        throw new apiError(401 , "unauthorized access");
    }

    const followedUserId = req.params.id  //jise current user ko follow krna hai
    console.log(followedUserId)

    if(!followedUserId) {
        throw new apiError(400 , "user id is required");
    }

    const user = await User.findById(userId);
    if(!user) {
        throw new apiError(404 , "user not found");
    }

    const followedUser = await User.findById(followedUserId);
    if(!followedUser) {
        throw new apiError(404 , "followed user not found");
    }

    if(userId === followedUserId) {
        throw new apiError(400 , "you can't follow yourself");
    }

    let message = "";

    // logic to follow or unfollo a user 

    if(user.following.includes.apply(followedUserId )) {
        user.following = user.following.filter( (id) => id !== followedUserId);
        followedUser.followers = followedUser.followers.filter( (id) => id !== userId);
        message = "user unfollowed successfully";
    }
    else {
        user.following.push(followedUserId);
        followedUser.followers.push(userId);
        message = "user followed successfully";
    }



    // likhne ka dusra tarika 

    // const isFollowing = user.following.includes(followedUserId);
    // if(isFollowing){
    //     // unfollow logic 
    //     Promise.all([
    //         User.updateOne(
    //             { _id : userId },
    //             {
    //                 $pull:{
    //                     following : followedUserId
    //                 }
    //             }
    //         ),
    //         User.updateOne(
    //             { _id : followedUserId },
    //             {
    //                 $pull : {
    //                     followers : userId
    //                 }
    //             }
    //         )
    //     ])
    // }
    // else {
    //     // follow logic 
    //     Promise.all([
    //         User.updateOne(
    //             { _id : userId },
    //             {
    //                 $push : {
    //                     following : followedUserId
    //                 }
    //             }
    //         ),
    //         User.updateOne(
    //             { _id : followedUserId },
    //             {
    //                 $push : {
    //                     followers : userId
    //                 }
    //             }
    //         )
    //     ])
    // }

// note --> promise.all tab use krte hai when we have multiple asynchronous operations to perform and we have to wait for all of them to complete





    await user.save( { validateBeforeSave : false });
    await followedUser.save({ validateBeforeSave : false });

    return res
    .status(200)
    .json(
        new apiResponse(200 , {} , message)
    )

})


// endpoint to get suggested user 

const getSuggestedUsers = asyncHandler( async(req , res) => {

    const currentUser  = await User.findById(req.user?._id);
    if(!currentUser) {
        throw new apiError(404 , "user not found");
    }

    // users that current user follows
    const followingUserIds = currentUser.following;

    // suggested user that are followed by the following of current user 
    const suggestedUsers = await User.find({
        _id:{$nin: [...followingUserIds , req.user._id]},
        following:{$in : followingUserIds}
    }).limit(5).select("-password -refreshToken");

    if (!suggestedUsers || suggestedUsers.length === 0) {
        const newUsers = await User.find()
            .limit(5)
            .sort({ createdAt: -1 })
            .select("-password -refreshToken");
        suggestedUsers.push(...newUsers);
    }

    suggestedUsers.shift();

    return res
    .status(200)
    .json(
        new apiResponse(200 , "suggested users fetched successfully" , suggestedUsers)
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateUser,
    changeCurrentPassword,
    getCurrentUser,
    followOrUnfollowUser,
    getSuggestedUsers

}