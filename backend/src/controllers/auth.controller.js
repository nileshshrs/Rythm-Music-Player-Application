import sessionModel from "../models/session.model.js";
import { createAccount, login, refreshUserAccessToken } from "../service/auth.service.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK, UNAUTHORIZED } from "../utils/constants/http.js";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const registerController = catchErrors(
    async (req, res) => {
        //validate request
        const request = {
            ...req.body,
            userAgent: req.headers["user-agent"],
        }
        //call service
        const { user, accessToken, refreshToken } = await createAccount(request)


        // return response


        return setAuthCookies(res, accessToken, refreshToken).status(CREATED).json(user, accessToken, refreshToken);

    }
)

export const loginController = catchErrors(
    async (req, res) => {

        const request = {
            ...req.body,
            userAgent: req.headers["user-agent"],
        }

        const { user, accessToken, refreshToken } = await login(request)
        return setAuthCookies(res, accessToken, refreshToken).status(OK).json({
            message: "successfully logged in.",
            user,
        });
    }

)

export const logoutController = catchErrors(
    async (req, res) => {


        const accessToken = req.cookies.access_token
        const { payload } = verifyAccessToken(accessToken || "")


        if (payload) {
            await sessionModel.findByIdAndDelete(payload.sessionID)
        }

        return clearAuthCookies(res).status(OK).json({
            message: "user logged out successfully."
        })

    }
)

export const refreshController = catchErrors(
    async (req, res) => {
        const refreshToken = req.cookies.refresh_token

        appAssert(refreshToken, UNAUTHORIZED, "missing refresh token.");


        const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken)
        if (newRefreshToken) res.cookie('refresh_token', newRefreshToken, getRefreshTokenCookieOptions())
        return res.status(OK).cookie('access_token', accessToken, getAccessTokenCookieOptions()).json({
            message: "access token has been refreshed."
        })
    }

)