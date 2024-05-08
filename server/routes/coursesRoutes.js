import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";

import {
  changeCourseVisibility,
  createCourse,
  getAllCourses,
  getBestSellerCourse,
  getNewestCourse,
  getUserCourses,
  searchUserCourses,
  findCourse,
  updateCourseIntro,
  deleteCourse,
} from "../controllers/coursesController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// instructor create course
router.post("/create-course", auth, upload.single("picture"), createCourse);

// update course intro
router.put(
  "/update-course-intro/:id",
  auth,
  upload.single("picture"),
  updateCourseIntro
);

// delete course
router.delete("/delete-course/:id", auth, deleteCourse);

// get user (instructor created) courses
router.get("/user-courses", auth, getUserCourses);

// search user (instructor created) courses
router.post("/search-user-courses", auth, searchUserCourses);

// change course visibilily
router.put("/change-course-visibility/:id", auth, changeCourseVisibility);

//get all Courses
router.get("/all", getAllCourses);

router.get("/getNewestCourse", getNewestCourse);

router.get("/getBestSellerCourse", getBestSellerCourse);

router.get("/find/:str", findCourse);

export { router as coursesRoutes };
