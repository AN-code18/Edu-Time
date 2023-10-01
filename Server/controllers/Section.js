const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;

    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properities",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });

    //update section in course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection,
        },
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: false,
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
    const { sectionName, sectionId } = req.body;

    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properities",
      });
    }

    //update data --> data find kiske basis pr krna h --->(section Id)
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: true },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
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
    const { sectionId } = req.params;
    //find id to delete

    await Section.findByIdAndDelete(sectionId);
    //TODO : we need to delete the entry of section Object Id from courseSchema
    //return response
    return res.status(500).json({
      success: true,
      message: "section deleted successfully",
      error: error.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Deleting section , please try again",
      error: error.message,
    });
  }
};
