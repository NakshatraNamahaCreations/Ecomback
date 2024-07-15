const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
// const protectedRoute = require("./Middleware/protectedRoute");

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected........."))
  .catch((err) => console.log("Database Not Connected!!!", err));

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("Public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
// configure Express to use body-parser for handling form submissions

const bannerRoutes = require("./Route/Banners/banner-content");
const youtubeVideoRoutes = require("./Route/Banners/youtube-video");
const freeMaterialRoutes = require("./Route/Content/free-material");
const myCourseRoutes = require("./Route/Courses/my-course");
const courseModuleRoutes = require("./Route/Courses/course-module");
const videoModuleRoutes = require("./Route/Courses/video-module");
const imageModuleRoutes = require("./Route/Courses/image-module");
const documentModuleRoutes = require("./Route/Courses/document-module");
const zipModuleRoutes = require("./Route/Courses/zip-module");
const couponRoutes = require("./Route/Coupons/manage-coupon");
const teamRouter = require("./Route/Peoples/team");
const user = require("./Route/Peoples/user");
const ratingsandreviews = require("./Route/RatingReview/ratings-reviews");
const notification = require("./Route/Notifications/notification");
const asin = require("./Route/asinSearch");
const keyword = require("./Route/keywordSearch");

app.get("/", (req, res) => {
  res.send("Hey, Jimmy!...This is kiru from the earth 😁🤞🐶👋🤗");
});

// Apply protectedRoute middleware to all routes under "/api"
// app.use("/api", protectedRoute);  //this will for protecting every  route in /api folder

app.use("/api/banner", bannerRoutes);
app.use("/api/youtube", youtubeVideoRoutes);
app.use("/api/freematerial", freeMaterialRoutes);
app.use("/api/mycourse", myCourseRoutes);
app.use("/api/coursemodule", courseModuleRoutes);
app.use("/api/video-module", videoModuleRoutes);
app.use("/api/image-module", imageModuleRoutes);
app.use("/api/document-module", documentModuleRoutes);
app.use("/api/zip-module", zipModuleRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/team", teamRouter);
app.use("/api/user", user);
app.use("/api/ratingsandreviews", ratingsandreviews);
app.use("/api/notification", notification);
app.use("/api", asin);
app.use("/api", keyword);

let port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
