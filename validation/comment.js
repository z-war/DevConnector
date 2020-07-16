const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function Validatecommentinput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  if (!Validator.isLength(data.text, { max: 50, min: 8 })) {
    errors.length = "comment length must be between 8 and 50 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
