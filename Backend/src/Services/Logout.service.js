import ApiError from "../utils/ApiError.js";
import pool from "../config/db.js";

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

export { LogoutUser };  