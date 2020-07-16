const Validator = require("validator");
const isEmpty = require("./is-empty");
const { default: validator } = require("validator");

module.exports = function validatePostInput(data) {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { max: 300, min: 10 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
