import { createUser, loginUser, LogoutUser } from "../Services/user.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { refreshAccessToken } from "../Services/token.service.js";
import {
  loginSchema,
  createUserSchema,
  logoutSchema,
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

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user,
      accessToken,
      refreshToken,
    }),
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

  return res.status(200).json(
    new ApiResponse(200, "User logged in successfully", {
      user,
      accessToken,
      refreshToken,
    }),
  );
};

const logoutUserSession = async (req, res, next) => {
  const { id: userId } = req.user;
  const { refresh_token } = req.body;
  const validate = logoutSchema.safeParse({ refresh_token });
  if (!validate.success) {
    throw new ApiError(400, validate.error.issues[0].message);
  }
  const result = await LogoutUser({ userId, refresh_token });
  return res
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", result));
};

const newAccessToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  const { accessToken } = await refreshAccessToken(refresh_token);
  return res.status(200).json(
    new ApiResponse(200, "New access token generated successfully", {
      accessToken,
    }),
  );
};

export { registerUser, loginnUser, logoutUserSession, newAccessToken };
