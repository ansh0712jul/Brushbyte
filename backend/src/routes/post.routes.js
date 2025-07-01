import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addnewPost, getAllPosts, getLoggedInUserPosts, likeorDislikePost } from "../controllers/post.controller.js";


const router = Router()
router.route("/add-new-post").post(verifyJwt , upload.single("image"),addnewPost);
router.route("/get-all-posts").get(verifyJwt , getAllPosts);
router.route("/get-current-user-posts").get(verifyJwt , getLoggedInUserPosts)
router.route("/like-or-dislike-post/:id").patch(verifyJwt , likeorDislikePost)

export default router;