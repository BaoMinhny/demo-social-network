import express from "express";
import protectRoute from "../middleware/protectedRoute.js";
import { getUserForSidebar } from "../controller/user.controller.js";

const router = express.Router();
router.get("/", protectRoute, getUserForSidebar)

export default router;