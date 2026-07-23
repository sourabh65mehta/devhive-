import pool from "../config/db.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { issueTokens } from "./token.service.js";    

const createUser = async ({username, email, password}) => {
    if(!username || !email || !password){
        throw new ApiError(400,'All fields are required');
    }

    if(password.length < 8){
        throw new ApiError(400,'Password must be at least 6 characters long');
    }
   
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email =$2' , [username, email]);
        if(existingUser.rows.length > 0){
            throw new ApiError(400,'Username or email already exists');
        }
        const password_hash = await bcrypt.hash(password,10);
        const result = await pool.query(
            'INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id,username, email, created_at, updated_at',
        [username, email, password_hash]);

        const{accessToken,refreshToken } = await issueTokens(result.rows[0]);

        return {user:result.rows[0], accessToken, refreshToken};
     
}

export { createUser};
