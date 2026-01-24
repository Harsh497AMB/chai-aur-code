import { asyncWrapProviders } from "async_hooks";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
  try {
    if(!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload
    (localFilePath , {
      resource_type: "auto"
    })
    //file has been uploaded successfully
    console.log("file has been uploaded on cloudinary",response.url)
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}


/* cloudinary.v2.uploader
  .upload("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/960px-Mahatma-Gandhi%2C_studio%2C_1931.jpg") */