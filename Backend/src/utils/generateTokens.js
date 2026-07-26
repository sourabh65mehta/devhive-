import jwt from 'jsonwebtoken';

const generateAccessTokens = (user) => {
   const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
   return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn }
    );
};

const generateRefreshTokens = (user) => {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
    return jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn }
    );
};

export { generateAccessTokens, generateRefreshTokens };