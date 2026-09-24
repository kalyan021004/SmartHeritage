
/* =====================================================
   4. controllers/authController.js
   ===================================================== */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {auth} = require("../config/firebaseAdmin");

/* REGISTER */

exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* LOGIN */

exports.loginUser = async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {


    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
  { id: user._id, name: user.name }, // ✅ add name
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1d" }
);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* LOGOUT */

exports.logoutUser = async (req, res) => {

  res.json({
    message: "Logged out successfully"
  });

};


/* GET CURRENT USER */

exports.getMe = async (req, res) => {

  try {

    const user = await User
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

// =====================================================
// GOOGLE LOGIN / FIREBASE LOGIN
// =====================================================

exports.googleLogin = async (req, res) => {
  console.log("=================================");
  console.log("GOOGLE LOGIN ROUTE HIT");
  console.log("=================================");

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase ID token is required"
      });
    }

    console.log("Firebase token received");

    // IMPORTANT:
    // auth is getAuth() from firebase-admin/auth
    const decodedToken = await auth.verifyIdToken(idToken);

    console.log("Firebase token verified");
    console.log("Firebase UID:", decodedToken.uid);
    console.log("Firebase Email:", decodedToken.email);

    const {
      uid,
      email,
      name,
      picture
    } = decodedToken;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not available"
      });
    }

    // Find existing MongoDB user
    let user = await User.findOne({ email });

    if (!user) {
      console.log("Creating new Google user");

      user = await User.create({
        name: name || "Google User",
        email,
        firebaseUid: uid,
        profileImage: picture || null,
        authProvider: "google"
      });

      console.log("Google user created:", user.email);
    } else {
      console.log("Existing user found:", user.email);

      // Link Firebase account to existing account
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
      }

      if (picture && !user.profileImage) {
        user.profileImage = picture;
      }

      await user.save();
    }

    // Your existing JWT system
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      process.env.JWT_SECRET || "secret123",
      {
        expiresIn: "1d"
      }
    );

    console.log("JWT generated successfully");

    return res.json({
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {

    console.error("=================================");
    console.error("GOOGLE AUTH ERROR");
    console.error("=================================");

    console.error(error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    return res.status(401).json({
      message: "Google authentication failed",
      error: error.message
    });
  }
};
