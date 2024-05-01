const { successResponse, errorResponse } = require("../utils/Response");
const bcrypt = require("bcryptjs");
const {
  findById,
  store,
  findByEmail,
} = require("../services/user.service");

const { requestValidation } = require("../utils/RequestValidation");
const { generateToken, verifyToken } = require("../utils/processToken");
module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false|email",
        password: "string|min:6",
        password_confirmation: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      if (req.body.password !== req.body.password_confirmation) {
        return errorResponse(res, 400, "Password does not match");
      }
      const userFound = await findByEmail(req.body.email);
      if (userFound) {
        return errorResponse(res, 409, "Email already in use");
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      delete req.body.password_confirmation;
      const user = await store(req.body);
      successResponse(res, 201, user, "Successfully created user");
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const schema = {
        email: "email|empty:false|email",
        password: "string|min:6",
      };
      requestValidation(res, req.body, schema);
      const userFound = await findByEmail(email);
      if (userFound) {
        if (bcrypt.compareSync(password, userFound.password)) {
          const data = {
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          };
          const token = generateToken(data);
          const payload = verifyToken(token);
          successResponse(res, 200, { payload, token }, "Login successful");
        } else {
          errorResponse(res, 400, "Invalid credentials");
        }
      } else {
        errorResponse(res, 400, "Invalid credentials");
      }
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  },
  getAuth: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      const user = await findById(req.user.id);
      delete user.password;
      successResponse(res, 200, user, "Successfully retrieved user");
    } catch (error) {
      errorResponse(res, 400, error.message);
    }
  }
};
