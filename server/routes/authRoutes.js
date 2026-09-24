const express2 = require("express");

const router = express2.Router();

const { requireAuth } = require("../middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  googleLogin
} = require("../controllers/authController");


// Normal registration
router.post(
  "/register",
  registerUser
);


// Normal login
router.post(
  "/login",
  loginUser
);


// Google/Firebase login
router.post(
  "/google",
  googleLogin
);


// Logout
router.post(
  "/logout",
  logoutUser
);


// Current user
router.get(
  "/me",
  requireAuth,
  getMe
);


module.exports = router;