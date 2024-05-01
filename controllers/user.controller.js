const { successResponse, errorResponse } = require("../utils/Response");
const bcrypt = require("bcryptjs");
const { findAll, findById, update } = require("../services/user.service");

const { requestValidation } = require("../utils/RequestValidation");
const { verifyToken } = require("../utils/processToken");
const fs = require("fs");
const moment = require("moment");
module.exports = {
  index: async (req, res) => {
    try {
      const users = await findAll();
      successResponse(res, 200, users, "Successfully retrieved all users");
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await findById(id);
      if (user) {
        successResponse(res, 200, user, "Successfully retrieved user");
      }
      errorResponse(res, 404, "User not found");
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const schema = {
        oldPassword: "string|min:6",
        newPassword: "string|min:6",
        confirmPassword: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      const user = await findById(req.user.id);
      if (bcrypt.compareSync(oldPassword, user.password)) {
        if (newPassword === confirmPassword) {
          req.body.password = bcrypt.hashSync(newPassword, 10);
          delete req.body.confirmPassword;
          delete req.body.oldPassword;
          delete req.body.newPassword;
          const user = await update(req.user.id, req.body);
          delete user.password;
          successResponse(res, 200, user, "Successfully updated password");
        } else {
          errorResponse(res, 400, "New password does not match");
        }
      }
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
  update: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      if (req.file) {
        req.body.image = "/uploads/profile/" + req.file.filename;
      }
      req.body.dateOfBirth = moment(req.body.dateOfBirth);
      const userFound = await findById(req.user.id);
      if (req.file && userFound.image) {
        if (fs.existsSync(`public/${userFound.image}`)) {
          fs.unlinkSync(`public${userFound.image}`);
        }
      }
      const user = await update(req.user.id, req.body);
      successResponse(res, 200, user, "Successfully updated user");
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
};
