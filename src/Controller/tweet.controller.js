import mongoose from "mongoose";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Tweet } from "../models/Tweet.model.js";
import { asyncHandlerPromises } from "../utils/asyncHandler";

const createTweet = asyncHandlerPromises(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is missing...");
  }

  const createdTweet = await Tweet.create({
    content: content,
    owner: req.user._id,
  });

  return res.status(200).json(200, createTweet, "tweet created successfully..");
});

const getUsersTweet = asyncHandlerPromises(async (req, res) => {
  const usersTweet = await Tweet.find({
    owner: req.user_id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, usersTweet, "user tweets fetched successfully..."),
    );
});

const updateTweet = asyncHandlerPromises(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if(!tweetId){
    throw new ApiError(404, "tweetId not found..")
  }

  if(!content){
    throw new ApiError(404, "Tweet Content is missing...")
  }

  const updatedTweet = await Tweet.findOneAndUpdate(
    {
      id: tweetId,
      owner: req.user._id,
    },

    {
      $set: { content, updatedAt: new Date() },
    },

    { new: true, runValidators: true },
  );

  if(!updateTweet){
    throw new ApiError(404, "tweet not found..")
  }

  return res.status(200).json(new ApiResponse(200, updateTweet, "tweet updated successfully.."))
});

const deleteTweet = asyncHandlerPromises(async (req, res) => {
  const { tweetId } = req.params;

  if(!tweetId){
    throw new ApiError(404, "tweetId not found...")
  }

  const deletedTweet = await Tweet.findOneAndDelete(
    {
      id: tweetId,
      owner: req.user._id,
    },
  );

  return res.status(200).json(new ApiResponse(200, null, "tweet deleted successfully.."))
});
