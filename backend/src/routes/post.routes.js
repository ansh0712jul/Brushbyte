import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addnewPost } from "../controllers/post.controller.js";

const router = Router()
router.route("/add-new-post").post(verifyJwt , upload.single("image"),addnewPost);


export default router;