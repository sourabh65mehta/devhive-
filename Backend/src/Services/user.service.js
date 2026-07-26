import pool from "../config/db.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { issueTokens } from "./token.service.js";    


const createUser = async ({username, email, password}) => {
   
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



const loginUser = async({email, password}) => {
    if(!email || !password){
        throw new ApiError(400,'All fields are required');
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(user.rows.length === 0){
        throw new ApiError(401,'Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if(!passwordMatch){
        throw new ApiError(401,'Invalid email or password');
    }
    
    const {password_hash, ...safeUser}= user.rows[0];

    const{accessToken,refreshToken } = await issueTokens(safeUser);

    

    return {user:safeUser, accessToken, refreshToken};    
    
}

const LogoutUser = async ({userId,refresh_token}) => {
      if(!refresh_token){
        throw new ApiError(400,"refresh token is required");
      }

      const result = await pool.query(
        'DELETE FROM refresh_tokens WHERE user_id =$1 AND token = $2 RETURNING id',
        [userId, refresh_token]
        )
        if(result.rows.length === 0){
            throw new ApiError(400,"Invalid refresh token");
        }
        return {message:"User logged out successfully"};
}

export { createUser,loginUser,LogoutUser};
