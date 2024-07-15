const userSchema = require("../../Model/Peoples/user");
const bcrypt = require("bcrypt");
const generateToken = require("../../Configuration/generate-jwt");
const {
  sendNotificationForRegisterUser,
  sendNotificationForCoursePurchasedUser,
} = require("../../Configuration/send-notifications");
// const notification = require("../../Model/Notifications/notification");
// const { firebase } = require("../../Firebase");

// const sendNotificationToMultipleDevices = async () => {
//   const data = await notification.findOne({
//     targetAudience: "When user signs up on app",
//   });
//   console.log("Notifications Statis:", data);
//   try {
//     console.log("yogi adad");
//     await firebase.messaging().send({
//       token:
//         "emBZN2uuSman_QKZC_eI5D:APA91bHtNfDR6WVPcyk0--yrGQwmsuC34t1tHJP5Ibtdxo9yw-dw7CL_ZDVf7S74yGFdm3-DC_e8IhJzezD0ulzOZ_634MyEEgXkZXNlnJFtzBl4v1l07MRSjxM4wE680M2RTetYmbAx",
//       notification: {
//         title: data.notificationTitle,
//         body: data.notificationDescription,
//       },
//       data: {
//         navigationId: "login",
//         chatId: "12345",
//       },
//     });
//     console.log(`Notification sent successfully to vendor with FCM token: $}`);
//   } catch (error) {
//     console.error(
//       `Error sending notification to vendor with FCM token :`,
//       error
//     );
//   }
// };
// --------------------------------------------------------------------------------------------------------
// const jwtUtils = require("../../Configuration/jwtUtils");

// this below one for verifying  the token and checking if it is expired or not.
// const token = '...'; // Your JWT token

// Verify the token
// jwtUtils.verifyToken(token)
//     .then(decoded => {
//         console.log('Decoded token:', decoded);
//     })
//     .catch(err => {
//         console.error('JWT verification failed:', err);
//     });

// // Decode the token
// const decodedToken = jwtUtils.decodeToken(token);
// console.log('Decoded token:', decodedToken);
// ----------------------------------------------------------------------------------------------------------

class User {
  async createUser(req, res) {
    try {
      const {
        name,
        phoneNumber,
        email,
        // gender,
        // password,
        // dateOfBirth,
        fcmToken,
        firebaseUserId,
      } = req.body;
      // let file = req.file.filename;

      const userExists = await userSchema.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(password, salt);

      const user = await userSchema.create({
        name,
        phoneNumber,
        email,
        // gender,
        // password: hashedPassword,
        // dateOfBirth,
        // profilePicture: file,
        fcmToken,
        firebaseUserId,
      });
      await sendNotificationForCoursePurchasedUser(fcmToken);
      // await sendNotificationForRegisterUser(fcmToken);
      res.status(200).json({
        status: true,
        message: "User created successfully!",
        data: user,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ error });
    }
  }

  // async userLogin(req, res) {
  //   const { email, password } = req.body;
  //   try {
  //     const user = await userSchema.findOne({ email });
  //     if (!user) {
  //       return res.status(400).json({ error: "Invalid email or password" });
  //     }
  //     const isPasswordValid = bcrypt.compare(password, user.password);
  //     if (!isPasswordValid) {
  //       return res.status(400).json({ error: "Invalid email or password" });
  //     }
  //     const token = generateToken(user._id);

  //     // =====================token verification=============================
  //     const verifyToken = token;
  //     // Verify the token
  //     jwtUtils
  //       .verifyToken(verifyToken)
  //       .then((decoded) => {
  //         console.log("Decoded token:", decoded);
  //       })
  //       .catch((err) => {
  //         console.error("JWT verification failed:", err);
  //       });

  //     // Decode the token
  //     const decodedToken = jwtUtils.decodeToken(verifyToken);
  //     console.log("Decoded token:", decodedToken);
  //     //==============verification completing here==========================

  //     // Return JWT token
  //     res.status(200).json({ token });
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  async userLogin(req, res) {
    const { email, password } = req.body;
    try {
      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await userSchema.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Email Address" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password" });
      }
      // Generate token
      const token = generateToken(user._id);
      // Return JWT token
      res.status(200).json({
        message: "Login Success",
        token,
        userName: user.name,
        _id: user._id,
        userStatus: "Online",
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getParticularUser(req, res) {
    try {
      const user = await userSchema.findOne({ _id: req.params.id });
      if (user) {
        return res.status(200).json({
          status: true,
          data: user,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }

  async getAllUer(req, res) {
    try {
      const allUser = (await userSchema.find()).reverse(true);
      if (allUser.length > 0) {
        return res.status(200).json({
          status: true,
          data: allUser,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { name, phoneNumber, email, gender, password, dateOfBirth } =
        req.body;
      let user = await userSchema.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "Id not found",
        });
      }
      await userSchema.findOneAndUpdate(
        { _id: userId },
        {
          name,
          phoneNumber,
          email,
          gender,
          password,
          // dateOfBirth,
        },
        {
          new: true,
        }
      );
      console.log("User", User);
      res.status(200).json({
        status: true,
        success: "Updated",
        data: User,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const _id = req.params.id;
      const user = await userSchema.findByIdAndDelete(_id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "user not found" });
      }
      return res
        .status(200)
        .send({ status: true, success: "user deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async purchaseCourse(req, res) {
    try {
      const findUser = await userSchema.findOne({ _id: req.params.id });

      if (!findUser) return res.status(404).json({ error: "User not found" });

      const { courseDetails } = req.body;

      // Update the courseDetails array of the found coupon
      findUser.courseDetails = courseDetails;
      await sendNotificationForCoursePurchasedUser();
      // Save the updated coupon
      await findUser.save();

      res.status(200).json({
        status: true,
        success: "Course Purchased",
        data: findUser, // Return the updated coupon
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async continueWatching(req, res) {
    try {
      const userId = req.params.id;
      const { videoDetails } = req.body;

      const findUser = await userSchema.findOne({ _id: userId });

      if (!findUser) {
        return res.status(404).json({ error: "No such record found" });
      }

      // Check if videoDetails is an array before attempting to iterate over it
      if (!Array.isArray(videoDetails)) {
        return res.status(400).json({ error: "Invalid videoDetails format" });
      }

      videoDetails.forEach((newEntry) => {
        const videoId = newEntry.videoId;
        const watchDuration = newEntry.watchDuration;
        const videoName = newEntry.videoName;
        const videoLink = newEntry.videoLink;
        const totalDuration = newEntry.totalDuration;

        const existingIndex = findUser.videoDetails.findIndex(
          (item) => item.videoId === videoId
        );

        if (existingIndex === -1) {
          findUser.videoDetails.push({
            videoId,
            watchDuration,
            videoName,
            videoLink,
            totalDuration,
          });
        } else {
          findUser.videoDetails[existingIndex].watchDuration = watchDuration;
        }
      });

      const updatedUser = await userSchema.findOneAndUpdate(
        { _id: userId },
        { $set: { videoDetails: findUser.videoDetails } },
        { new: true }
      );

      return res.status(200).json({
        message: "Updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to update the user" });
    }
  }

  async startConversations(req, res) {
    try {
      const findUser = await userSchema.findOne({ _id: req.params.id });
      if (!findUser) {
        return res.status(401).json({ error: "user not found" });
      }
      const { chat } = req.body;
      const newConversation = {
        chat,
        timestamp: new Date(),
      };

      findUser.conversationList.push(newConversation);

      await findUser.save();
      res.status(200).json({
        status: true,
        success: "Message sent",
        data: findUser.conversationList,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const userController = new User();
module.exports = userController;
