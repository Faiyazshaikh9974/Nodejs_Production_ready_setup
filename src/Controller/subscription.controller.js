import mongoose from "mongoose";
import Subscription from "../models/Subscription.model.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const toggleSubscription = asyncHandlerPromises(async (req, res) => {
  const { channelId } = req.params;

  //match channelId with Model ChannelId
  //match the req.user_id with SubscriberId and remove if already exiting if not then add the id

  if (!channelId) {
    throw new ApiError(400, "Channel Id is missing..");
  }

  const deleted = await Subscription.deleteOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (deleted.deletedCount > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "user unsubscribe channel.."));
  } else {
    await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "user subscribed channel successfully.."));
});

export const getUserChannelSubscribers = asyncHandlerPromises(asycn(req, res)=>{
    
})
