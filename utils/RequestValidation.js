const Validator = require("fastest-validator");
const { errorResponse } = require("../utils/Response");
const v = new Validator();
module.exports = {
  requestValidation: (res, request, schema) => {
    const validate = v.validate(request, schema);
    return validate;
  },
};
