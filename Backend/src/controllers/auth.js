import { createUser, loginUser, LogoutUser } from "../Services/user.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { refreshAccessToken } from "../Services/token.service.js";
import {
  loginSchema,
  createUserSchema,
} from "../validators/user.validator.js";

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const validate = createUserSchema.safeParse({ username, email, password });
  if (!validate.success) {
    throw new ApiError(400, validate.error.issues[0].message);
  }
  const { user, accessToken, refreshToken } = await createUser({
    username,
    email,
    password,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", { user })
  );
};

const loginnUser = async (req, res, next) => {
  const { email, password } = req.body;
  const validate = loginSchema.safeParse({ email, password });
  if (!validate.success) {
    throw new ApiError(400, validate.error.issues[0].message);
  }
  const { user, accessToken, refreshToken } = await loginUser({
    email,
    password,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", { user }),
  );
};

const logoutUserSession = async (req, res, next) => {
  const userId = req.user?.id;
  const refresh_token = req.cookies?.refreshToken || req.body?.refresh_token;
  if (userId && refresh_token) {
    try {
      await LogoutUser({ userId, refresh_token });
    } catch (e) {
      console.warn("Logout db cleanup warning:", e.message);
    }
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", { message: "Logged out" }));
};

const newAccessToken = async (req, res, next) => {
  const refresh_token = req.cookies?.refreshToken || req.body?.refresh_token;
  const { accessToken } = await refreshAccessToken(refresh_token);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  return res.status(200).json(
    new ApiResponse(200, "New access token generated successfully", {
      accessToken,
    }),
  );
};

export { registerUser, loginnUser, logoutUserSession, newAccessToken };
