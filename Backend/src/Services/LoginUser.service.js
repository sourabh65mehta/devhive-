
import pool from "../config/db.js"; 
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { issueTokens } from "./token.service.js";


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

export { loginUser };