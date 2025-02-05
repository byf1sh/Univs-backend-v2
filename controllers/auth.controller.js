const { successResponse, errorResponse } = require("../utils/Response");
const bcrypt = require("bcryptjs");
const {
  findById,
  store,
  findByEmail,
  findByUsername,
} = require("../services/user.service");

const { requestValidation } = require("../utils/RequestValidation");
const { generateToken, verifyToken } = require("../utils/processToken");
const moment = require("moment");
module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false|email",
        username: "string|empty:false",
        dateOfBirth: "string|empty:false",
        password: "string|min:6",
        password_confirmation: "string|min:6",
      };
      // requestValidation(res, req.body, schema);
      if (req.body.password !== req.body.password_confirmation) {
        return errorResponse(res, 400, "Password does not match");
      }
      const emailFound = await findByEmail(req.body.email);
      if (emailFound) {
        return errorResponse(res, 409, "Email already in use");
      }
      const usernameFound = await findByUsername(req.body.username);
      if (usernameFound) {
        return errorResponse(res, 409, "Username already in use");
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      delete req.body.password_confirmation;
      req.body.dateOfBirth = moment.utc(req.body.dateOfBirth);
      const user = await store(req.body);
      return successResponse(res, 201, user, "Successfully created user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const schema = {
        email: "email|empty:false|email",
        password: "string|min:6",
      };
      // requestValidation(res, req.body, schema);
      const userFound = await findByEmail(email);
      if (userFound) {
        if (bcrypt.compareSync(password, userFound.password)) {
          const data = {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          };
          // const token = generateToken(data);
          // const payload = verifyToken(token);
          return successResponse(
            res,
            200,
            { payload, token },
            "Login successful"
          );
        } else {
          return errorResponse(res, 400, "Invalid credentials");
        }
      } else {
        return errorResponse(res, 400, "Invalid credentials");
      }
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  getAuth: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const user = await findById(req.user.id);
      delete user.password;
      return successResponse(res, 200, user, "Successfully retrieved user");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
