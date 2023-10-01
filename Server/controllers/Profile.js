import Profile from "../models/Profile";
import User from "../models/User";

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get UserId
    const id = req.user.id;

    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    // find profile
    const UserDetails = await User.findById(id);
    const profileId = UserDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update profile --> here -->object bana hua h toh here we use (save function) to create/update any entry in DB
    //aur jha Object nhi banay h toh create function ko use kr k DB m entry create/update krnge
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.about = about;

    await profileDetails.save();

    //return response
    return res.status(200).json({
      status: true,
      message: "Profile Details updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//delete account/profile
// explore -> scheduling process of deletion  --> chroneJOb

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
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //TODO --> unenroll user from all enrolled courses
    //delete user  --> second delete user from db
    await User.findByIdAndDelete({ _id: id });

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
      .populate("AdditionalDetails")
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching details of user",
      error: error.message,
    });
  }
};
