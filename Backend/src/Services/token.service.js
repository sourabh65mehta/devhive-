import { generateAccessTokens,generateRefreshTokens } from "../utils/generateTokens.js";
import pool from "../config/db.js"; 
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


const issueTokens = async (user) => {
    const accessToken = generateAccessTokens(user);
    const refreshToken = generateRefreshTokens(user);

    const expires_at = new Date(Date.now() + 7*24*60*60*1000); // 7 days from now

    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token,expires_at) VALUES ($1,$2,$3)',
        [user.id, refreshToken, expires_at]
    )
    return { accessToken, refreshToken };
}

const refreshAccessToken = async (refresh_token) => {
    if(!refresh_token){
        throw new ApiError(400,"Refresh token is required");
    }
    let decoded ;
    try {
        decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error('REFRESH TOKEN VERIFY ERROR:', error);
        throw new ApiError(401,"Invalid or expired refresh token");
    }
    

    const result = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2',
        [refresh_token,decoded.id]
    );
    if(result.rows.length === 0){
        throw new ApiError(400,"Invalid refresh token");
    }

    const userResult = await pool.query(
        'SELECT id,username,email FROM users WHERE id = $1',
        [decoded.id]
    );
    const accessToken = generateAccessTokens(userResult.rows[0]);
    return { accessToken };
}



export { issueTokens,refreshAccessToken };