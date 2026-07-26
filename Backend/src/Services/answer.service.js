import  pool  from "../config/db.js";
import  ApiError  from "../utils/ApiError.js";

const createAnswer = async({body,user_id,question_id,image_url}) =>{
    if(!body || !user_id || !question_id ){
        throw new ApiError(400,"all fields are required")
    }
    const result = await pool.query(`
        INSERT INTO answers (body,user_id,question_id,image_url) VALUES ($1,$2,$3,$4) RETURNING id,body,user_id,question_id,image_url,created_at,updated_at
    `,[body,user_id,question_id,image_url])
    return result.rows[0]
}

const getAnswers = async({question_id,limit,offset}) =>{
    if(!question_id){
        throw new ApiError(400,"question id is required")
    }
    const result = await pool.query(`
        SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3
    `,[question_id,limit,offset])

    if(result.rows.length === 0 ){
        throw new ApiError(404,"no answer found")
    }
   
    return result.rows
}
const getAnswerById = async({id}) =>{
    if(!id){
        throw new ApiError(400,"answer id is required")
    }
    const result = await pool.query(`
        SELECT * FROM answers WHERE id = $1
    `,[id])
    if(result.rows.length === 0){
        throw new ApiError(404,"answer not found")
    }
    return result.rows[0]
}

const updateAnswer = async({id,body,image_url,user_id}) =>{
    if(!id  || !user_id){
        throw new ApiError(400,"all fields are required")
    }
    const result = await pool.query(`
        UPDATE answers SET body = COALESCE($1,body), image_url = COALESCE($2,image_url) ,updated_at = NOW()
        WHERE id = $3 AND user_id = $4 RETURNING id,body,user_id,question_id,image_url,updated_at
    `,[body,image_url,id,user_id])
    if(result.rows.length === 0){
        throw new ApiError(404,"answer not found")
    }
    return result.rows[0]
}

const deleteAnswer = async({id,user_id}) =>{
    if(!id || !user_id){
        throw new ApiError(400,"all fields are required")
    }
    const result = await pool.query(`
        DELETE FROM answers WHERE id = $1 AND user_id = $2 RETURNING id
    `,[id,user_id])
    if(result.rows.length === 0){
        throw new ApiError(404,"answer not found")
    }
    return result.rows[0]
}
   
   

export {createAnswer,getAnswers,getAnswerById,updateAnswer,deleteAnswer}; 