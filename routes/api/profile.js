const express = require("express");
const router = express.Router();

// @route   GET api/user/test
// @desc    test profile route
// @access Public
router.get("/test", (req, res) => res.json({ message: "profile works" }));

module.exports = router;
