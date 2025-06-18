import userModel from "../models/users.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { NOT_FOUND, OK } from "../utils/constants/http.js";

export const userController = catchErrors(
    async (req, res) => {
        const user = await userModel.findById(req.userID);
        appAssert(user, NOT_FOUND, "user not found");
        return res.status(OK).json(
            user.omitPassword()
        )
    }
)


export const getAllUsersController = catchErrors(
  async (req, res) => {
    const users = await userModel.find();
    // Omit passwords for all users
    const usersWithoutPasswords = users.map(user => user.omitPassword());
    return res.status(OK).json(usersWithoutPasswords);
  }
);