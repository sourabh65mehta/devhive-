import jwt from 'jsonwebtoken';

const generateAccessTokens = (user) => {
   return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
};

const generateRefreshTokens = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
};

export { generateAccessTokens, generateRefreshTokens }; 