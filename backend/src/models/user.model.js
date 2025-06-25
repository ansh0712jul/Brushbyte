import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username:{
            type : String,
            trim:true,
            unique : true,
            required :[true, "name is required"]
        },
        email:{
            type:String ,
            trim:true,
            required :[true, "email is required"],
            unique : true,
            lowercase : true
        },
        password:{
            type:String,
            required : [true, "password is required"],
        },
        profileImg:{
            type : String
        },
        bio:{
            type : String,
            trim:true
        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
        ],
        following : [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        posts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post"
            }
        ],
        bookmarks:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post"
            }
        ],
        refreshToken : {
            type : String
        }
    },
{
    timestamps : true
})


// hashing password befor saving it to db using pre hook 
userSchema.pre("save" ,async function(next) {
    
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password , 10);
    next();
})

// custom method to check password 

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password);
}

// custom method to generate access token 
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:this.id,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    
    return jwt.sign(
        {
            _id:this.id,
            username : this.username,
            email : this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN
        }
    )
}


// creating user model
const User = mongoose.model("User", userSchema);
export default User; 