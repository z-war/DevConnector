const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function ValidateExperianceInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Job company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "Job Start Date field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
