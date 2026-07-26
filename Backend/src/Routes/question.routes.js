import {
  getAllQuestionsController,
  questionController,
} from "../controllers/questions.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getQuestion } from "../controllers/questions.controller.js";
import Asynchandler from "../utils/Asynchandler.js";
import { Router } from "express";
import { updateQuestionController } from "../controllers/questions.controller.js";
import { deleteQuestionController } from "../controllers/questions.controller.js";
import upload from "../config/multer.js";
const router = Router();

router.post("/", authMiddleware, upload.single("image"), Asynchandler(questionController));
router.get("/", Asynchandler(getAllQuestionsController));
router.get("/:id", Asynchandler(getQuestion));
router.patch("/:id", authMiddleware, upload.single("image"), Asynchandler(updateQuestionController));
router.delete("/:id", authMiddleware, Asynchandler(deleteQuestionController));

export { router as questionRoute };
