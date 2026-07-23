import { Router } from "express";

import Asynchandler from "../utils/Asynchandler.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { registerUser,loginnUser,logoutUserSession,newAccessToken } from "../controllers/auth.js";

const router = Router();

router.post('/register', Asynchandler(registerUser));
router.post('/login', Asynchandler(loginnUser));

router.post('/logout', authMiddleware,Asynchandler(logoutUserSession));
router.post('/refresh-token', Asynchandler(newAccessToken));

export default router;

