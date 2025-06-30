
import express from "express"
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/sign-up").post(upload.single("profileImg") , registerUser)
router.route("/sign-in").post(loginUser)


// protected routes

router.route("/logout").post(verifyJwt , logoutUser);
router.route("/user/:id/get-profile").get(verifyJwt , getProfile);

export default router