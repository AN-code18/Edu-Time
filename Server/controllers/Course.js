const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//createCourse Handler function
exports.createCourse = async (req, res) => {
  try {
    //if course create kr rhe --  toh already login ho
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImages;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details:", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    //chevk category valid or not
    const categoryDetails = await Category.findById(tag);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details are not found",
      });
    }

    //upload  image to coudinary
    const thumbnailImages = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImages.secure_url,
    });

    //add the new course to the schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update the Tag ka schema --HW

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};

//get all course
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("Instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data fro all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot fetch Course data",
      error: error.message,
    });
  }
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    // get course ki id from req.body by destructure
    const { courseId } = req.body;

    //find course details and populate all details  -> ((kisi ki object Id nhi chahhiye kyu ki Course model m sbki ObjectId oass ki hui h humne))
    //course model m instructor field m User ka reference h --> user k andr additionalDetails  m PROFILE ka reference h  --> populate Profile data
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
