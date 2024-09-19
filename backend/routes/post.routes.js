import express from "express";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from "../controller/post.controller.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/feed",protectRoute, getFeedPosts);
router.post("/create",protectRoute, createPost);
router.get("/:id",protectRoute, getPost);
router.delete("/delete/:id",protectRoute, deletePost);
router.put("/like/:id",protectRoute, likeUnlikePost);
router.post("/reply/:id",protectRoute, replyToPost);
router.get("/user/:username", getUserPosts);

export default router;