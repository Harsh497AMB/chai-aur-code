import { Router } from "express";
import { loginuser, registerUser , logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyJWT , logoutUser)


export default router;