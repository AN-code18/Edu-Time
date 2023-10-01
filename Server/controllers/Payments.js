const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const mongoose = require("mongoose");

//capture the payment and initiate the Rajorpay order
//course kon buy kr rha h -> user id , konsi course buy kr rha h -> course id
exports.capturePayment = async (req, res) => {
  //get course id , user id
  const { course_id } = req.body;
  /*auth middleware --> req k andr payload ko append kiya tha --> so req.user.id*/
  const userId = req.user.id;
  //validation
  //valid course id
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }

  //valid courseDetails
  let course;
  try {
    course = await Course.findById(course_id);

    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the",
      });
    }
    // user already pay for that course or not
    //course m ser id is stored in ObjectID format and in user m it is stored in String ,, here we have User id from User
    //convert User ID in ObjectID from string --> chek course m yeh user ki di phke se toh nhi h --> if yes it means student is already enrolled.

    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  //create order
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    //return response

    return res.status(500).json({
      success: true,
      courseName: course.couseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

//verify Signature of Razorpay and serve --> match server k andr ki secret aur razorpay ne joh secret send kiya h usko match krna h

exports.verifySignature = async (req, res) => {
  //server signature
  const webhookSecret = "123456789";

  //razorpay secret --> req se nikalana h
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorisez");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      //fulfil the actions
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);

      //find the student and add the course to the
      const enrolledStudent = await Course.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      //mail send kro confirmation k liye
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulation , from Anisha",
        "Congratulation , You are onboared into new course"
      );

      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        message: "Signature Verifies and Course added",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }
};
