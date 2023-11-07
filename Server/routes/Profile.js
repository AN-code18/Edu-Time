const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  deleteAccount,
  updateProfile,
  getAllDetails,
  updateDisplayPicture,
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.put("/updatedisplaypicture", auth,  updateDisplayPicture);

router.get("/getUserDetails", auth, getAllDetails);

module.exports = router;
