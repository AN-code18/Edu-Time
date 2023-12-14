const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPsswordToken--> link ki mail send

exports.resetPasswordToken = async (req, res) => {
  try {
    // 1 --> get email from req.body
    //without destructuring email find kiya hai yha
    const email = req.body.email;
    // 2 --> user exist or not by this email , email verification/validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }

    // 3 --> generate token for unique (link)
    const token = crypto.randomBytes(20).toString("hex");

    // 4 --> update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 36000000,
      },
      { new: true }
    );

    console.log("DETAILS", updateDetails);

    // 5 --> create url --> url will be sent from frontend side
    const url = `http://localhost:3000/update-password/${token}`;

    // 6 --> send email containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    // 7 --> return response
    return res.json({
      success: true,
      message:
        "Email sent successfully, Please Check Your Email to Continue Further",
       data: updateDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password link",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //1 - data fetch
    const { password, confirmPassword, token } = req.body;

    //2 validation of password
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }
    //3 - how to find user (which user) --> using token that we generated above in resetPasswordToken
    //3.1 --> New password will be update in DB , user ki collection m password field m
    const userDetails = await User.findOne({ token: token });

    //4 --> if no entry --> invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is inValid",
      });
    }

    //4.1 --> either token time expire
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        error:error.message,
        message: "Token is expired , please regenerate your token again",
      });
    }
    
    //5 --> now save password in Db  but first Hash it'
    const hashedPassword = await bcrypt.hash(password, 10);

    //6 --> update password in DB
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //7 --> return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "",
    });
  }
};
