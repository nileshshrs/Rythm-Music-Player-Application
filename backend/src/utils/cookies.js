import { fifteenDaysFromNow, fifteenMinutesFromNow } from "./date.js";

export const refresh_path = "/api/v1/auth/refresh";

const defaults = {
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

export const getAccessTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = () => ({
    ...defaults,
    expires: fifteenDaysFromNow(),
    path: refresh_path,
});

export const setAuthCookies = (res, accessToken, refreshToken) => {
    return res
        .cookie("access_token", accessToken, getAccessTokenCookieOptions())
        .cookie("refresh_token", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res) => {
    return res
        .clearCookie("access_token", getAccessTokenCookieOptions())
        .clearCookie("refresh_token", getRefreshTokenCookieOptions());
};
