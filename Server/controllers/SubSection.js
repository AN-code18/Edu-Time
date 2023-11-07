const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from req.body
    //sectionID --> joh naya subsection hoga woh section m insert hoga  toh kis section m insert hoga that'sy uski id we are fetching from req.body
    const { sectionId, title,  description } = req.body;

    //extract file/video
    const video = req.files.video;
    //validation
    if (!sectionId || !title || !description || !video) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log(video);
    //upload video to  cloudinary and in response we get secure URL
    const UploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    console.log(UploadDetails);
    //create a sub-Section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${UploadDetails.duration}`,
      description: description,
      videoUrl: UploadDetails.secure_url,
    });
    // update section with thi sub-Section ObjectID
    const updatedSections = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    //return response
    return res.status(200).json({
      success: true,
      message: "Sub Section created successfully",
      data: updatedSections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Creating SubSection , please try again",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    if (title !== undefined) {
      subSection.title = title;
    }
    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }
    await subSection.save();

    //find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }
    //find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
