import { createAccount, login } from "../service/auth.service.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK } from "../utils/constants/http.js";
import { setAuthCookies } from "../utils/cookies.js";

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