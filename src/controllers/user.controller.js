import { asyncHandler } from "../utils/AsyncHandler.js";
import { APIerror } from "../utils/APIerror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIresponse.js";


const generateAccessTokensAndAccessTokens = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken= user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    return {refreshToken , accessToken}

  } catch (error) {
    throw new APIerror(500 , "token failed")
  }
}

const registerUser = asyncHandler(async (req, res) => {

  console.log(req.body)
  console.log(req.files)

  //taking input from frontend
  const {username , email , fullname , password}=req.body;

  console.log("user input taken")
  
  //validation
  if (username==="") {
    throw new APIerror(400, "fill usernmae")
  }
  if (email==="") {
    throw new APIerror(400, "fill email")
  }
  if (fullname==="") {
    throw new APIerror(400, "fill fullname")
  }
  if (password==="") {
    throw new APIerror(400, "fill password")
  }

console.log("all fields are valid")

  //check if user already exist
const existedUser =await User.findOne({
  $or:[{username},{email}]
})

if (existedUser) {
  throw new APIerror(400, "user already exists")
}

console.log("entered fields are unique")

//
const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

console.log(avatarLocalPath , "avatarPath")
console.log(coverImageLocalPath , "CIPath")

//check avatar path
if (!avatarLocalPath) {
  throw new APIerror(400, "avatar is required")
}

console.log("avatar path checked");


//upload to cloudinary
const avatar =await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)


//check avatar saved to cloudinary
if (!avatar) {
  throw new APIerror(400, "avatar file is required")
}
console.log("files has been uploaded to cloudinary successfully!!")

//adding to database
 const user = await User.create({
  fullname,
  username,
  email,
  password,
  avatar:avatar.url,
  coverImage:coverImage?.url || ""
})

console.log("adding to database process carried out")

//check if user is created or not
const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)

if (!createdUser) {
  return new APIerror(500 , "something went wrong while registering")
}

return res.status(201).json(
  new APIResponse(200 , createdUser, "user registered successfully")
)
  
console.log("User registered successfully!!")

});


//LOGIN?//////
const loginuser = asyncHandler(async(req,res)=>{

  //get data from user
  const {email , username , password}= req.body
//checking if email or user is empty or not
  if (!username && !email){
    throw new APIerror(400 , "username or email required")
  }
//finding if usernname or email exist or not
  const searchedUser = await User.findOne({
  $or:[{username},{email}]
})
//if not exist say user not found
if (!searchedUser) {
  throw new APIerror(400 , "user not found")
}
//check if password is corret
const isPasswordValid = await searchedUser.isPasswordCorrect(password)
//if password incorect throw errror
if (!isPasswordValid) {
  throw new APIerror(400 , "galat password he")
}
//generating refresh and access token
const {refreshToken , accessToken} = await generateAccessTokensAndAccessTokens(searchedUser._id)

const loggedInUser = await searchedUser.findById(searchedUser._id).select("-password -refreshToken")
//random
const options ={
  http:true,
  secure:true
}
//returning response
return res
.status(200)
.cookie("accessToken" , accessToken , options)
.cookie("refreshToken" , refreshToken , options)
.json(
  new APIResponse(
    200,
    {
      searchedUser:loggedInUser
    },
    "user loggedIn succcessfully"
  )
)
})


///////LOGOUT???////
const logoutUser = asyncHandler(async(req,res)=>{
  
})


export { registerUser ,
  loginuser
};
