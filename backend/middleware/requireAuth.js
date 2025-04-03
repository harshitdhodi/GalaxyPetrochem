const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  try {
    // Ensure that cookie-parser is used to parse cookies
    if (!req.cookies) {
      console.log("No cookies found on request");
      return res.status(400).json({ message: "No cookies found" });
    }

    const token = req.cookies.jwt;
    console.log("Received token:", token);

    if (!token) {
      console.log("Unauthorized user: No token provided");
      return res.status(403).json({ message: "Unauthenticated user" });
    }

    // Decode the token using the secret
    const decodedToken = await jwt.verify(token, "secret");
    console.log("Decoded token:", decodedToken);

    if (!decodedToken.id) {
      console.log("Token doesn't contain a valid user ID");
      return res.status(403).json({ message: "Invalid token structure" });
    }

    // Attach the user ID to the request object
    req.newAdmin = decodedToken.id;
    console.log("User ID from token:", req.newAdmin);

    next();
  } catch (err) {
    console.log("Error verifying token:", err.message);
    console.log("Unable to authenticate user, invalid token");
    res.status(403).json({ message: "Forbidden: Invalid or missing token" });
  }
};

module.exports = { requireAuth };
