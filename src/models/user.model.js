import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema =new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true,
        },
         email:{
            type:String,
            required:true,
            unique:true,
        },
        fullname:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,//cloudinary service
            required:true,
        },
        coverimage:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:[true , "password is required"],
        },
        refreshToken:{
            type:String
        }
}, {
    timestamps:true
}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified('passworrd')) return next();
    this.password = hash(this.password, 10)
    next()
})

userSchema.methods.isPassordCorect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {__id:this.__id},
         process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        })
    
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {__id:this.__id},
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
}

export const user = mongoose.model("user ", user)