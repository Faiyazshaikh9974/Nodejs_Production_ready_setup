import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import { z } from "zod";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";

const registerUserSchema = z.object({
  email: z.string().email("Invalid Email"),
  fullName: z.string().min(3, "Full name must be atleast 3 characters"),
  username: z.string().min(3).max(20),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avtar: z.string().url("Avtar must be a valid url").optional(),
});

//utility function for generating the access and refresh token...
const generateRefreshTokenAndAccessToken = async (id) => {
  const user = await User.findById(id);

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;

  const savedRefreshToken = await user.save({ validateBeforeSave: false });

  if (!savedRefreshToken) {
    throw new ApiError(
      500,
      "Something went wrong refresh token not stored in DataBase",
    );
  }

  return { refreshToken, accessToken };
};

//Register
export const registerUser = asyncHandlerPromises(async (req, res) => {
  const parseData = registerUserSchema.safeParse(req.body);

  if (!parseData.success) {
    throw new ApiError(400, parseData.error.errors[0].message);
  }

  const { email, fullName, username, password, avtar } = parseData.data;
  //get the detail from the front-end
  //validate if values are null or not define
  //check if user is already exist or not
  //check for avtars if yes - send to cloudinary..
  //check
  //after uploading on cloudinary and get the url
  //create userObject and send all the data to the database
  //don't send the password and refresh token as response...

  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (existingUser) {
    throw new ApiError(409, "username or email is already exists ");
  }

  const avtarImage = req.files?.avtar?.[0]?.path;
  const coverImage = req.files?.coverImage?.[0]?.path;

  if (!avtarImage) {
    throw new ApiError(409, "avtar image is empty..");
  }

  const [avtarImageCloud, coverImageCloud] = await Promise.all([
    uploadImage(avtarImage),
    coverImage ? uploadImage(coverImage) : null,
  ]);

  const avtarUrl = avtarImageCloud.url;
  const coverImageUrl = coverImageCloud.url;
  // if(!multerImage){
  //   throw new ApiError(409, "Avtar Image is missing..")
  // }

  const userData = {
    email: email,
    username: username.toLowerCase(),
    fullName: fullName,
    password: password,
    avtar: { url: avtarUrl, public_id: avtarImageCloud.public_id },
    coverImage:
      { url: coverImageUrl, public_id: coverImageCloud.public_id } || {},
  };

  const user = new User(userData);
  const savedUser = await user.save();

  let dbUser = await User.findById(savedUser._id).select(
    "username email avtar fullName coverImage",
  );

  if (!dbUser) {
    throw new ApiError(409, "Something went wrong user not saved..");
  }

  res
    .status(200)
    .json(new ApiResponse(200, dbUser, "User Created Successfully"));
});

//Login
export const loginUser = asyncHandlerPromises(async (req, res) => {
  const { email, username, password } = req.body;

  // ✅ && not || — only throw if both are absent
  if (!email && !username) {
    throw new ApiError(400, "email or username is required");
  }

  // ✅ +password overrides select:false on schema
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials, check your password");
  }

  const { refreshToken, accessToken } =
    await generateRefreshTokenAndAccessToken(user._id);

  // ✅ Fetch clean user — no password, no refreshToken in response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

//Logout
export const logoutUser = asyncHandlerPromises(async (req, res) => {
  //remove both tokens from the cookies
  //also set the null the refresh token into the database..

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    {
      new: true,
    },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//regerate refresh Token after expery
export const RefreshToken = asyncHandlerPromises(async (req, res) => {
  const inCommingRefreshToken = req.cookies.refreshToken;

  if (!inCommingRefreshToken) {
    throw new ApiError(401, "Something Went Wrong Refresh Token not found..");
  }

  const DecodedRefreshToken = jwt.verify(
    inCommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  if (!DecodedRefreshToken) {
    throw new ApiError(
      403,
      "Something went Wrong unable to verify the Refresh Token..",
    );
  }

  const user = await User.findById(DecodedRefreshToken.id);

  if (!user) {
    throw new ApiError(403, "Something went Wrong in RefreshAccessToken");
  }

  if (user.refreshToken !== inCommingRefreshToken) {
    throw new ApiError(402, "Refresh Token is not matched");
  }

  const { NewrefreshToken, accessToken } = generateRefreshTokenAndAccessToken(
    user._id,
  );

  user.refreshToken = NewrefreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", NewrefreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, user, "Refresh and Access Token Regenerated"));
});

//change password..
export const changePassword = asyncHandlerPromises(async (req, res) => {
  const { oldPassword, newPassword, conformPassword } = req.body;

  if (newPassword !== conformPassword) {
    throw new ApiError(400, "password is mismatched");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCurrect = user.comparePassword(oldPassword);

  if (!isPasswordCurrect) {
    throw new ApiError(400, "Invalid Old Password..");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password change successfully"));
  //old password
  //new password + confirm password
  //check if old password is match or not
  //check if the new password is not equal to old password..
  //both are same new and comfirm password
  //check password using that mongoose pre hook
});

//get current user
export const getCurrentUser = asyncHandlerPromises(async (req, res) => {
  const curretUser = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );

  if (!curretUser) {
    throw new ApiError(
      400,
      "Something went wrong user credencials not found..",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, curretUser, "current user fetch successfully.."),
    );
});

export const updateAccountDetail = asyncHandlerPromises(async (req, res) => {
  //get all the detail from the body
  //find the user
  //and update and save

  console.log(req.body);
  const { fullName, email } = req.body;

  if (!email || !fullName) {
    throw new ApiError(400, "All field are required");
  }

  // console.log(req.user?._id)
  // console.log(req.params.id)

  if (req.user?._id != req.params.id) {
    throw new ApiError(403, "Forbidden");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        email,
        fullName,
      },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account detail update successfully"));
});

export const changeAvtarImage = asyncHandlerPromises(async (req, res) => {
  const NewfilePath = req.file?.path;

  const oldUser = User.findById(req.user?._id);

  if (!NewfilePath) {
    throw new ApiError(400, "Image field is required..");
  }

  const response = await uploadImage(NewfilePath);

  if (!response) {
    throw new ApiError(
      400,
      "Something went wrong while uploading avtarImage on cloudinary",
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avtar: {
          url: response.url,
          public_id: response.public_id,
        },
      },
    },
    { new: true },
  ).select("-password");

  //delete the previous avtar image from the cloudinary after uploading the new image

  if (oldUser?.avtar?.public_id) {
    await cloudinary.uploader.destroy(oldUser.avtar.public_id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avtar Image updated successFully"));
  //new image
  //upload on the cloudynery
  //get the url
  //update that url into the database
  //send response back...
});

export const changeCoverImage = asyncHandlerPromises(async (req, res) => {
  const NewfilePath = req.file?.path;

  if (!NewfilePath) {
    throw new ApiError(400, "Image field is required..");
  }

  const response = await uploadImage(NewfilePath);

  if (!response) {
    throw new ApiError(
      400,
      "Something went wrong while uploading Coverimage on cloudinary",
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avtar: response.url,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage Updated Successfully.."));
});

const getUserChannelProfile = asyncHandlerPromises(async (req, res) => {
  const { username } = req.params;
  const userProfile = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },

    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        isSubscribed: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        avtar: 1,
        email: 1,
        coverImage: 1,
        username: 1,
      },
    },
  ]);

  if (!userProfile.length) {
    throw new ApiError(404, "channed does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userProfile[0], "User channel fetched successfully"),
    );
});
