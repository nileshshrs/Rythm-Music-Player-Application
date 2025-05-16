import { AppError } from "../utils/AppError.js";
import { INTERNAL_SERVER_ERROR } from "../utils/constants/http.js";


const handleAppError = (res, error) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};

const error = (err, req, res, next) => {
    
    if (err instanceof AppError) {
        return handleAppError(res, err);
    }
    console.log(`Path: ${req.path}, error: ${err}`);
    return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
}

export default error;