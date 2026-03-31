import { Router } from "express";
import {
  changeAvtarImage,
  changeCoverImage,
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  RefreshToken,
  registerUser,
  updateAccountDetail,
} from "../Controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

export const router = Router();

const cpUpload = upload.fields([
  {
    name: "avtar",
    maxCount: 1,
  },
  { name: "coverImage", maxCount: 1 },
]);

router.post("/register", cpUpload, registerUser);
router.post("/login", loginUser);

//Secured Route
router.post("/logout", verifyJwt, logoutUser);

router.patch("/:id", verifyJwt, updateAccountDetail);

router.post("/refresh-token", RefreshToken);

router.get("/current-user", verifyJwt, getCurrentUser);

router.post("/change-password", verifyJwt, changePassword);

router.post("/change-avtar", verifyJwt, upload.single("avtar"), changeAvtarImage )
router.post("/change-coverimage", verifyJwt, upload.single("coverImage"), changeCoverImage )

router.get("/channel/:username", verifyJwt, getUserChannelProfile);

router.get("/watch-history", verifyJwt, getWatchHistory);


export default router;
