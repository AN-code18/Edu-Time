const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//1 sendOTP --> before signUP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }
    //if user not found with this email -> then generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated:", otp);

    //check unique otp in db
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
      });
    }

    const otpPayload = { email, otp };

    //create an entry for OTP in DB
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP BODY", otpBody);

    //return response successfull
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error occured while sending OTP",
    });
  }
};

//signup---> for Registering Users
exports.signUP = async (req, res) => {
  try {
    //data fetch from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //2- password match krlo -->(password & confirmpassword)
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword  do not match , Please try again",
      });
    }
    //chk user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most resent OTP stored for the user in db
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

      console.log(recentOtp);

    //validate OTP
    if (recentOtp.length == 0) {
      //OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp != recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    //entry created in DB of a Profile of user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    //ProfileDetails ki joh id aayegi Db m entry create hone k baad woh additionalDetails m save hogi
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error:error.message,
      message: "User cannot be registered, please try again",
    });
  }
};

//login ---> for authenticating users

exports.login = async (req, res) => {
  try {
    //1 get data from req.body
    const { email, password } = req.body;

    //2 data validation - Check if email or password is missing
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required , please fill all details",
      });
    }
    //3  user exist or not check it--> already registered h tbhi login kro
    const user = await User.findOne({ email }).populate("additionalDetails");

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }
    //4 generate jwt token , after password matched
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      user.token = token;
      user.password = undefined;

      //5 create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    }
    //password not matched
    else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

//changePassword
exports.changePassword = async (req, res) => {
  try {
    //get data from req.user
    const userDetails = await User.findById(req.user.id);

    //get oldpassword , newpassword , confirmpassword from req.body
    const { oldPassword, newPassword } = req.body;

    //validation old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }
    //update password in db
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: encryptedPassword,
      },
      { new: true }
    );
    //send email - password update hogya

    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (err) {
      console.log("Error occurred while sending email:", err);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }
    //return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
