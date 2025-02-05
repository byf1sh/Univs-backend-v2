const jwt = require("jsonwebtoken");
const jwt_secret = "ABCDEFGHIJKLMNOPQRSUTAWawdilh!@#!@";
module.exports = {
  generateToken: (data) => {
    const token = jwt.sign(data, jwt_secret);
    return token;
  },
  verifyToken: (token) => {
    const payload = jwt.verify(token, jwt_secret);
    return payload;
  },
};
