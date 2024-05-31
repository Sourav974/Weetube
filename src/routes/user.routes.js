import { Router } from "express";
import { registerUser, test } from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  //   upload.fields([
  //     {
  //       name: "avatar",
  //       maxCount: 1,
  //     },
  //     {
  //       name: "coverImage",
  //       maxCount: 1,
  //     },
  //   ]),
  registerUser
);

router.route("/test").post(test);

export default router;
