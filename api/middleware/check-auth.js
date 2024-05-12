const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("decoded", decoded);
    req.userData = decoded;
    console.log("req.userData,", req.userData);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
