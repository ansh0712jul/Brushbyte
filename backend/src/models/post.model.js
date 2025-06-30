import mongoose  from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        trim:true,
        default:""
    },
    image:{
        type:String,
        required:[true, "image is required"],
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "author is required"],
        
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }


}, 
{
    timestamps:true
})

const Post = mongoose.model("Post", postSchema);

export default Post;