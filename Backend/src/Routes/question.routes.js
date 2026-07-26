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
const router = Router();

router.post("/", authMiddleware, Asynchandler(questionController));
router.get("/", Asynchandler(getAllQuestionsController));
router.get("/:id", Asynchandler(getQuestion));
router.patch("/:id", authMiddleware, Asynchandler(updateQuestionController));
router.delete("/:id", authMiddleware, Asynchandler(deleteQuestionController));

export { router as questionRoute };
