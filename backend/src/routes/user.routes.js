
import express from "express"
import { registerUser } from "../controllers/user.controller.js";

import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/sign-up").post(upload.single("profileImg") , registerUser)

export default router