import express from 'express'
import {getConversations, getMessage, sendMessage } from '../controller/message.controller.js';
import protectRoute from '../middleware/protectedRoute.js';


const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.post("/", protectRoute,  sendMessage)
router.get("/:otherUserId", protectRoute, getMessage);

export default router;