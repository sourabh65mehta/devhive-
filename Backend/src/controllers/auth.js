import { createUser } from "../Services/createuser.service.js";
import { loginUser } from "../Services/LoginUser.service.js";   
import ApiResponse from "../utils/ApiResponse.js";
import { LogoutUser } from "../Services/Logout.service.js";
import { refreshAccessToken } from "../Services/token.service.js";



const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const { user, accessToken, refreshToken } = await createUser({username, email, password});
   
    
    return res.status(201).json(new ApiResponse(201,"User registered successfully", { user, accessToken, refreshToken })); 
}

const loginnUser = async (req, res, next) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser({email, password});
    
    return res.status(200).json(new ApiResponse(200,"User logged in successfully", { user, accessToken, refreshToken })); 
}

const logoutUserSession = async (req, res, next) => {
    const { id :userId } = req.user;
    const { refresh_token } = req.body;
    const result = await LogoutUser({userId, refresh_token});
    return res.status(200).json(new ApiResponse(200,"User logged out successfully", result));
}

const newAccessToken = async (req, res, next) => {
    const { refresh_token } = req.body;
    const { accessToken } = await refreshAccessToken(refresh_token);
    return res.status(200).json(new ApiResponse(200,"New access token generated successfully", { accessToken }));
}

export { registerUser,loginnUser ,logoutUserSession,newAccessToken};