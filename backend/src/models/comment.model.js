import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({

    text:{
        type:String,
        required:[true, "text is required"],
        trim:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "author is required"],
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:[true, "post is required"],
    }
})

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;