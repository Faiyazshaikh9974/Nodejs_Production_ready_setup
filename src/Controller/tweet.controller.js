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

  return res.status(200).json(200, createTweet, "tweet created successfully..")
});

const getUsersTweet = asyncHandlerPromises( async (req, res) =>{
    

    const usersTweet = await Tweet.find({
        owner: req.user_id
    });

    return res.status(200).json( new ApiResponse(200, usersTweet, "user tweets fetched successfully..."))
})

const updateTweet = asyncHandlerPromises( async(req, res) =>{
    const tweetId
})
