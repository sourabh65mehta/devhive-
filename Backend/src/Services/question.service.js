import ApiError from "../utils/ApiError.js";
import pool from "../config/db.js";


const createQuestion = async({title,body,image_url,user_id}) =>{
    if(!title || !body || !user_id){
         throw new ApiError(400,"title,body and user are required");
    }
    const result = await pool.query(`
       INSERT INTO questions (title,body,image_url,user_id)
       VALUES ($1,$2,$3 ,$4)
       RETURNING id,title,body,image_url,created_at
        
        `,[title,body,image_url,user_id])

    return result.rows[0];
}


const getAllQuestions = async({limit ,offset})=>{
    const result = await pool.query(`
       SELECT questions.id,questions.title,questions.body,questions.image_url,questions.created_at,
       users.username
       FROM questions
       JOIN users ON questions.user_id = users.id
       ORDER BY  questions.created_at DESC 
       LIMIT $1 OFFSET $2
        
        `,[limit,offset])
    if(result.rows.length===0){
        throw new ApiError(404,"no question found")
    }


        return result.rows;
}

const getQuestionById = async({id}) =>{
    const result = await pool.query(`
       SELECT questions.id,questions.title,questions.body,questions.image_url,questions.created_at,
       users.username
       FROM questions
       JOIN users ON questions.user_id = users.id
       WHERE questions.id = $1
        
        
        `,[id])

    if(result.rows.length === 0 ){
        throw new ApiError(404,"Question not found ")
    }

        return result.rows[0];
}

const updateQuestion = async({title,body,image_url,question_id,user_id})=>{
    const result = await pool.query(`
       UPDATE questions
       SET title = COALESCE($1,title),body=COALESCE($2,body),image_url=COALESCE($3,image_url)
       ,updated_at=NOW()
       WHERE id=$4 AND user_id=$5
       RETURNING id,title,body,image_url,updated_at
       
       `,[title,body,image_url,question_id,user_id])
       if(result.rows.length===0){
           throw new ApiError(404,"Question not found")
       }

       return result.rows[0];
}

const deleteQuestion = async({question_id,user_id})=>{

    if(!question_id || !user_id){
        throw new ApiError(400,"question id and user id are required")
    }
    const result = await pool.query(`
       DELETE FROM questions
       WHERE id=$1 AND user_id=$2
       RETURNING id
       
       `,[question_id,user_id])
    if(result.rows.length===0){
        throw new ApiError(404,"Question not found")
    }

    return result.rows[0];
}



export {getAllQuestions,getQuestionById,updateQuestion,createQuestion,deleteQuestion}