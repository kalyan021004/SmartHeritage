/* =====================================================
   5. routes/authRoutes.js
   ===================================================== */

const express2 = require("express");
const router = express2.Router();

const {
  registerUser,
  loginUser,
  logoutUser
} = require("../controllers/authController");

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/logout",
  logoutUser
);

module.exports = router;
