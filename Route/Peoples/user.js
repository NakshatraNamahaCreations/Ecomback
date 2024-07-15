const express = require("express");
const router = express.Router();
const userController = require("../../Controller/Peoples/user");
const multer = require("multer");
const protectedRoute = require("../../Middleware/protectedRoute");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/user"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file with current timestamp
  },
});

const upload = multer({ storage: storage });

router.post(
  "/createuser",
  // upload.single("profilePicture"),
  userController.createUser
);
router.post("/userlogin", protectedRoute, userController.userLogin);
router.get("/getparticularuser/:id", userController.getParticularUser);
router.get("/getallusers", userController.getAllUer);
router.put("/updateuser/:id", userController.updateUser);
router.put("/purchasecourse/:id", userController.purchaseCourse);
router.put("/continuewatching/:id", userController.continueWatching);
router.delete("/deleteuser/:id", userController.deleteUser);
router.post("/startconversations/:id", userController.startConversations);

module.exports = router;
