import { APIerror } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
import {generateAccessTokensAndAccessTokens} from "../controllers/user.controller.js"

export const verifyJWT = asyncHandler(async(req , res , next)=>{
    try {
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("token extracted from request")
        console.log("token:", token)
        if (!token) {
            throw new APIerror(401 , "Unauthorized request")
        }
        console.log("token found in request, verifying...")
        console.log("token to verify:", token)
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        console.log("token verified successfully, decoded token:", decodedToken)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user fetched from database:", user)
    
        if (!user) {
            throw new APIerror(401 , "invalid access token")
        }
        console.log("user found in database, attaching user to request object")
    
        req.user = user;
        next()
        
    } catch (error) {
        throw new APIerror( 401 , error?.message || "Invalid access token")
    }
})