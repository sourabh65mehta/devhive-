import {
  answerSchema,
  updateAnswerSchema,
} from "../validators/answer.validator.js";
import {
  createAnswer,
  getAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
} from "../Services/answer.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createAnswerController = async (req, res) => {
  const result = answerSchema.safeParse(req.body);
  if (!result.success) {
    console.log("Is error.issues defined?", result.error.issues);
    throw new ApiError(400, result.error.issues[0].message);
  }
  const { id } = req.user;
  const { questionId } = req.params;
  const image_url = req.file ? req.file.secure_url : null;
  const answer = await createAnswer({
    ...result.data,
    user_id: id,
    question_id: questionId,
    image_url,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "answer posted successsfully", answer));
};
const getAnswersController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const { questionId } = req.params;
  const answers = await getAnswers({ question_id: questionId, limit, offset });
  return res
    .status(200)
    .json(new ApiResponse(200, "answers fetched successfully", answers));
};
const getAnswerByIdController = async (req, res) => {
  const { answerId } = req.params;
  const answer = await getAnswerById({ id: answerId });
  return res
    .status(200)
    .json(new ApiResponse(200, "answer fetched successfully", answer));
};
const updateAnswerController = async (req, res) => {
  const { answerId } = req.params;
  const { id } = req.user;
  const result = updateAnswerSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, result.error.issues[0].message);
  }
  const image_url = req.file ? req.file.secure_url : null;
  const answer = await updateAnswer({
    id: answerId,
    body: result.data.body,
    image_url,
    user_id: id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "answer updated successfully", answer));
};

const deleteAnswerController = async (req, res) => {
  const { answerId } = req.params;
  const { id } = req.user;
  const deleteAnswers = await deleteAnswer({ id: answerId, user_id: id });
  return res
    .status(200)
    .json(new ApiResponse(200, "answer deleted successfully", deleteAnswers));
};

export {
  createAnswerController,
  getAnswersController,
  getAnswerByIdController,
  updateAnswerController,
  deleteAnswerController,
};
