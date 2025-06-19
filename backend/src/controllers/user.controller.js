import userModel from "../models/users.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { BAD_REQUEST, NOT_FOUND, OK } from "../utils/constants/http.js";

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


// PATCH /api/user
export const updateUserController = catchErrors(
  async (req, res) => {

    // Only allow these fields to be updated by the user
    const allowedFields = ["username", "bio", "image", "email"];
    const updateData = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    // Don't allow empty update
    appAssert(Object.keys(updateData).length > 0, BAD_REQUEST, "No valid fields to update");

    const user = await userModel.findByIdAndUpdate(
      req.userID,
      { $set: updateData },
      { new: true }
    );

    appAssert(user, NOT_FOUND, "user not found");

    return res.status(OK).json(user.omitPassword());
  }
);
