const jwt = require("jsonwebtoken");
const jwt_secret = "th!s!s@jwt$ecret";
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
