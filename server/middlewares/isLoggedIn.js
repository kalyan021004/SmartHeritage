/* =====================================================
   6. middleware/isLoggedIn.js
   ===================================================== */

const jwt2 = require("jsonwebtoken");

const isLoggedIn = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Not logged in"
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt2.verify(
      token,
      process.env.JWT_SECRET ||
      "secret123"
    );

    req.userId = decoded.id;

    next();

  }

  catch (error) {

    return res.status(401).json({
      message: "Unauthorized"
    });

  }

};

module.exports = isLoggedIn;