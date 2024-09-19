import  express  from "express";
import { login,logout,signup,followUnFollowUser, updateUser, getUserProfile, getSuggestedUser } from "../controller/users.controller.js";
import protectRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.post ("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/follow/:id", protectRoute, followUnFollowUser);

router.put("/update/:id", protectRoute, updateUser);

router.get("/profile/:query", protectRoute, getUserProfile);

router.get("/suggested",protectRoute, getSuggestedUser )

export default router;