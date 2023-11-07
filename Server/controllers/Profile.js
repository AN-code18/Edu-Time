const Profile = require("../models/Profile");
const User = require("../models/User");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    //get UserId
    const id = req.user.id;

    // find profile
    const UserDetails = await User.findById(id);
    const profileId = UserDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    //update profile --> here -->object bana hua h toh here we use (save function) to create/update any entry in DB
    //aur jha Object nhi banay h toh create function ko use kr k DB m entry create/update krnge
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.about = about;

    await profileDetails.save();

    // Find the updated user details
    const updatedDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return response
    return res.status(200).json({
      status: true,
      message: "Profile Details updated Successfully",
      profileDetails,
      updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    //get id --> jisko dlt krna h --> dlt krne k liye user dlt page pr aayega it means user login h --> get id
    const id = req.user.id;
    //validation of id --> user exist or not
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    //delete profile --> user hoga aur uski hogi kuch additional details --> first remove addtional details
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
    });

    // unenroll user from all enrolled courses
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      );
    }
    //delete user  --> second delete user from db
    await User.findByIdAndDelete({ _id: id });

    await CourseProgress.deleteMany({ userId: id });
    //return response
    return res.status(200).json({
      status: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong while deleting account",
      error: error.message,
    });
  }
};

exports.getAllDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;

    //validation and get user details --> only containe user ki id not details of user --> to get user details we user populate(additional detils)
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching details of user",
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    return res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/////////////////////*************************///////////////////
/*exports.getEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();

    var SubSectionlength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubSectionlength = 0;

      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      let totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });
    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};*/
