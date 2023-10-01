const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    expired: 5 * 60,
  },
});

//func--> send email
// user email and id
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification email from StudyNotion",
      otp
    );
    console.log("Email sent Successfully:", mailResponse);
  } catch (error) {
    console.log("Error occured while sending mail:", error);
    throw error;
  }
}

OTPSchema.pre("save" , async function(next){
  await sendVerificationEmail(this.email , this.otp);
  next();
})

module.exports = mongoose.model("OTP", OTPSchema);
