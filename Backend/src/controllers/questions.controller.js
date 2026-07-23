import ApiError from "../utils/ApiError.js";
import { questionSchema } from "../validators/question.validator.js";
import { createQuestion } from "../Services/question.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getAllQuestions, getQuestionById, updateQuestion } from "../Services/question.service.js";

import { deleteQuestion } from "../Services/question.service.js";  



const questionController = async(req,res) => {
    const result = questionSchema.safeParse(req.body)
    if(!result.success){
        console.log('Is error.issues defined?', result.error.issues);
        throw new ApiError(400,result.error.issues[0].message)
    }
    const {id} = req.user
    const question = await createQuestion({...result.data,user_id:id});
    return res.status(201).json(new ApiResponse(201,"question posted successsfully",question))
}

const getAllQuestionsController = async(req,res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) ||10
    const offset = (page-1)*limit

    const questions = await getAllQuestions ({limit,offset})
    return res.status(200).json(new ApiResponse(200,"questions fetched successfully",questions))
}

const getQuestion = async(req,res) =>{
    const {id} = req.params
    if(!id){
        throw new ApiError(400,"question id not found")
    }

    const questionId = await getQuestionById({id})
    return res.status(200).json(new ApiResponse(200,"question id fetched successfully",questionId))

}

const updateQuestionController = async(req,res) =>{
    const result  = questionSchema.safeParse(req.body)
    if(!result.success){
        throw new ApiError(400,result.error.issues[0].message);
    }
    const {title,body,image_url} = result.data
    const { id: question_id } = req.params
    const { id: user_id } = req.user
    const putQuestion = await updateQuestion({title,body,image_url,question_id,user_id})
    return res.status(200).json(new ApiResponse(200,"question updated successfully",putQuestion))
}

const deleteQuestionController = async(req,res) =>{
    const { id: question_id } = req.params
    const { id: user_id } = req.user
    const deleteQ = await deleteQuestion({question_id,user_id})
    return res.status(200).json(new ApiResponse(200,"question deleted successfully",deleteQ))
}



export {questionController,getAllQuestionsController,getQuestion,updateQuestionController,deleteQuestionController}