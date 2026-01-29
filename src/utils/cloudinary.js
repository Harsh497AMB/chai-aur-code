import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import path from "path";



cloudinary.config({ 
  cloud_name:"duhknqli9", 
  api_key:845968296231772, 
  api_secret:"lFBHQves1-bJyhESUO22C4ZZwJ0"
});



const uploadOnCloudinary = async (localFilePath) =>{
  try {
    if (!localFilePath) {return null};

    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })

    //file has been uploaded successfully
    console.log("file has been uploaded on cloudinary" , response.url);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath)
    
console.log(
  "ENV CHECK 👉",
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET ? "SECRET OK" : "SECRET MISSING"
);

    console.log("cloudinary error", error)
    return null;
  }
}

export {uploadOnCloudinary}