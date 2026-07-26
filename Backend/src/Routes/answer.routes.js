import { Router } from "express";
import {
  createAnswerController,
  getAnswersController,
  getAnswerByIdController,
  updateAnswerController,
  deleteAnswerController,
} from "../controllers/answer.controller.js";
import upload from "../config/multer.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import Asynchandler from "../utils/Asynchandler.js";

const router = Router();

router.post(
  "/:questionId",
  authMiddleware,
  upload.single("image"),
  Asynchandler(createAnswerController),
);
router.get("/question/:questionId", authMiddleware, Asynchandler(getAnswersController));
router.get("/:answerId", authMiddleware, Asynchandler(getAnswerByIdController));
router.patch(
  "/:answerId",
  authMiddleware,
  upload.single("image"),
  Asynchandler(updateAnswerController),
);
router.delete(
  "/:answerId",
  authMiddleware,
  Asynchandler(deleteAnswerController),
);

export default router;
