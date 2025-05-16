import sessionModel from "../models/session.model.js";
import userModel from "../models/users.model.js";
import appAssert from "../utils/appAssert.js";
import { CONFLICT, UNAUTHORIZED } from "../utils/constants/http.js";
import { accessTokenSignOptions, refreshTokenSignOptions, signTokens } from "../utils/jwt.js";

export const createAccount = async (data) => {
  const existingUser = await userModel.exists({
    $or: [
      { email: data.email },
      { username: data.username }
    ]
  });

  appAssert(!existingUser, CONFLICT, "Email or username already in use");

  const user = await userModel.create({
    email: data.email,
    username: data.username,
    password: data.password,
  });

  const session = await sessionModel.create({
    userID: user._id,
    userAgent: data.userAgent,
  });

  const refreshToken = signTokens(
    { sessionID: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signTokens(
    { userID: user._id, sessionID: session._id },
    accessTokenSignOptions
  );

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};


export const login = async ({ usernameOrEmail, password, userAgent }) => {
  // get the user by email or username 
  const user = await userModel.findOne({
    $or: [
      { email: usernameOrEmail },
      { username: usernameOrEmail }
    ]
  });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  // validate the password
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");
  // create a session
  const userID = user._id;
  const session = await sessionModel.create({
    userID,
    userAgent,
  });

  const sessionInfo = {
    sessionID: session._id,
  }

  // Sign refresh token
  const refreshToken = signTokens(sessionInfo, refreshTokenSignOptions);

  // Sign access token
  const accessToken = signTokens(
    { ...sessionInfo, userID: user._id },
    accessTokenSignOptions
  );

  // Return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
}