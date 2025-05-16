import assert from 'node:assert';
import { AppError, AppErrorCode } from './AppError.js';

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */

const appAssert = (condition, httpStatusCode, message, errorCode) => {
    try {
        assert(condition);
    } catch {
        throw new AppError(httpStatusCode, message, errorCode);
    }
};

export default appAssert;