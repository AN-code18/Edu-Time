const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require("../models/User");
const User = require("../models/User");

//auth --> check authentication by verfying jsonwebtoken
//jsonwebtoken send kiya h woh sahi h ya nahi --> token mil gya toh sahi h else glt h
// ways of finding token --> (cookie , body , bearer token)  ---> avoid using body

exports.auth = async (req, res, next) => {
  try {
    //extract JWT token from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    //if token is missing , then return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token  Missing",
      });
    }
    // Verifying the JWT using the secret key stored in environment variables
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      // joh bhi request k andr user object h uske andr yeh decode daal do  [req m role ki value added h  --> kyu ki authentication k time payload m role bhi added h payload h  and here we are adding decode toh decodem payload  bhi  h]
      req.user = decode;
    } catch (err) {
      //verification isssue
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent --> verify role
// 1 -> req k andr role added h usse verify kr lo
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Students only! ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be Verified , please try again ",
    });
  }
};

//isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    console.log(userDetails);

    console.log(userDetails.accountType);

    if (userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Instructor",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role Can't be Verified , please try again ",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "isAdmin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for isAdmin only! ",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role Can't be Verified, please try again ",
    });
  }
};
