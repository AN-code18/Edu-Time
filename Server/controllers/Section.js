const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;

    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required Properities",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });

    //update section in course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating section , please try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId, courseId } = req.body;

    //data validation
    /* if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properities",
      });
    }*/

    //update data --> data find kiske basis pr krna h --->(section Id)
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName},
      { new: true }
    );
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //return response
    return res.status(200).json({
      success: true,
      message: section,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Updating section , please try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    //get id --> assuming that we are sending ID in params
    const { sectionId, courseId } = req.body;

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }
    //delete sub section
    // await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //return response
    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Deleting section , please try again",
      error: error.message,
    });
  }
};
