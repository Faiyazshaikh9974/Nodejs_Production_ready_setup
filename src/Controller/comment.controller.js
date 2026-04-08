import mongoose from "mongoose";
import { Comment } from "../models/Comment.model.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getVideoComments = asyncHandlerPromises(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "VideoId is not found in params");
  }

  const videoObjectId = new mongoose.Types.ObjectId(videoId);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const comments = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },

    {
      $sort: { createdAt: -1 },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Video Comment fetch Successfully.."));
});
