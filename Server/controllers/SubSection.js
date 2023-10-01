const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
import {uploadImageToCloudinary} from '../utils/imageUploader'

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from req.body
    //sectionID --> joh naya subsection hoga woh section m insert hoga  toh kis section m insert hoga that'sy uski id we are fetching from req.body
    const { sectionId, title, timeDuration, description } = req.body;

    //extract file/video
    const video = req.files.videoFile;
    //validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //upload video to  cloudinary and in response we get secure URL
    const UploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    //create a sub-Section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
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
    );
    //HW--> log updated section here after adding populate query
    //return response
    return res.status(200).json({
      success: true,
      message: "Sub Section created successfully",
      updatedSections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Creating SubSection , please try again",
      error: error.message,
    });
  }
};


//hw--> update and delete subsection code