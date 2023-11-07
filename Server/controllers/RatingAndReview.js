const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// createRatingAndReviews
exports.createRating = async (req, res) => {
  try {
    //  -->[get rating , reviews , course ki content] aur user ne diya h rating toh user must be logged in so we need userId,{user ky cmnt kr rha h ,kis course m cmnt kr rha h}
    const userId = req.user.id;
    //  --> fetch data course ki from req.body
    const [rating, review, courseId] = req.body;
    //  --> check if user is enrolled or not in course
    const courseDetails = await Course.findOne(
      { _id: courseId, studentsEnrolled: { $elemMatch: { $eq: userId } } } // matching userId -> user enrolled h ki nhi by using [$elemMatch and $eq operator]
    );

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }
    //  --> ky pta user ne phle se review kiya ho course ko
    /** jao ratingAndReviews collection k andr and check it yeh userId & course exist krti h ki nhi  */
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewd by the user",
      });
    }
    //  --> create rating and review using (save / create )--> to yeh rating and review k model k andr chli gyi --> whenever new rating comes update Rating and Reviews  model
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    //  --> ab kyu ki yeh rating kisi course k upar hui h toh we need to attach/add this rating and review to the course ki model m  -> update course model with this rating and reviews
    //courseId k through find and insert the rating details using ($push )operator
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    //  --> send response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview,
    });
  } catch (error) {
    cosnole.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAverageRatingAndReviews
exports.getAverageRating = async (req, res) => {
  try {
    //input -> get courseId
    const courseId = req.body.courseid;

    // calculate average rating
    const result = await RatingAndReview.aggregate([
      //find entry from RatingAndReviews jiski courseId ....  match ho iss given courseId se
      // iss case se humlog ko sirf 1 value mil rhi h joh result k [0]th index pr store h
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId), // doing this bez .. courseId starting m string thi we converted it into Object Id
        },
      },
      {
        $group: {
          _id: null, // jitni bhi entries h mere pass sbko maine 1 single group m wrap kr diya
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //return response
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating, // aggregate function return an array
      });
    }

    //if no rating / reviews exist
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0  , no rating given till now",
      averageRating: 0,
    });
    // return average rating
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllRatingAndReviews
exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", // sirf yeh sari field ki  values chhiye mujhe
      })
      .populate({
        path: "course",
        select: "courseName",
      })

      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
