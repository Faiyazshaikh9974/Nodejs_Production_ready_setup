import mongoose from "mongoose";
import { Like } from "../models/Like.model.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const toggleVideoLike = asyncHandlerPromises(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "VideoId is not found in params");
  }

  const videoObjectId = new mongoose.Types.ObjectId(videoId);

  //toggle like on video
  const existingLike = await Like.findOne({
    video: videoObjectId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    // Unlike the video
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
  } else {
    // Like the video
    await Like.create({
      video: videoObjectId,
      likedBy: req.user._id,
    });
    return res.status(200).json(new ApiResponse(200, null, "Video liked"));
  }
});

export const toggleCommentLike = asyncHandlerPromises(async (req, res) => {
  const { commentId } = req.params;

  const commentObjId = new mongoose.Types.ObjectId(commentId);

  const deleted = await Like.delete({
    LikedBy: req.user._id,
    comment: commentObjId,
  });
  if(deleted) {
    res.status(200).json(new ApiResponse(200, null, "comment unLiked"));
  }

  await Like.create({
    LikedBy: req.user._id,
    comment: commentObjId
  })

  return res.status(200).json(new ApiResponse(200, null, "Comment Liked"));

   
});

export const toggleTweetLike = asyncHandlerPromises(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(404, "Tweet id not found..");
  }

  const tweetObjectId = new mongoose.Types.ObjectId(tweetId);
  const existingLike = Tweet.findOne({
    tweet: tweetObjectId,
    LikedBy: req.user._id,
  });

  if (exitingLike) {
    await Tweet.findByIdAndDelete({
      id: existingLike._id,
    });
  } else {
    await Tweet.create({
      LikedBy: req.user._id,
      tweet: tweetObjectId,
    });

    res.status(200).json(new ApiResponse(200, null, "Tweet Liked"));
  }
});

export const getAllLikedVideos = asyncHandlerPromises(async (req, res) => {
  const LikedVideos = await Like.aggregate([
    {
      $match: { LikeBy: new mongoose.Types.ObjectId(req.user._id) },
    },

    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "allLikedVideos",
      },
    },

    {
      $unwind: "$allLikedVideos",
    },
    {
      $lookup: {
        from: "users",
        localField: "allLikedVideos.owner",
        foreignField: "_id",
        as: "owner",
      },
    },

    { $unwind: "$owner" },

    {
      $project: {
        _id: 0,
        allLikedVideos: {
          _id: "$allLikedVideos._id",
          coverImage: "$allLikedVideos.coverImage",
          title: "$allLikedVideos.title",
          owner: {
            _id: "$allLikedVideos.owner._id",
            username: "$allLikedVideos.owner.username",
            fullName: "$allLikedVideos.owner.fullName",
            avatar: "$allLikedVideos.owner.avatar",
          },
        },
      },
    },
  ]);

  if (!LikedVideos) {
    throw new ApiError(400, "Something went wrong with Database Query");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        LikedVideos,
        "All Liked Video fetched Successfully..",
      ),
    );
});
