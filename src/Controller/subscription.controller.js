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

  export const getUserChannelSubscribers = asyncHandlerPromises (async(req, res) => {

    //so this controller list all subcribers of specific channel..
    //we have channelId and userId 
    //we can match the channel Id and return all the list of subscribers for specific channel

    const {channelId } = req.params;

    if(!channelId){
      throw new ApiError(400, "channel id is not found...");
    }

    const subscribersList = await Subscription.aggregate([
      {
        $match: {
        channel: new mongoose.Types.ObjectId(channelId)
      }
      },

      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribersList"
        }
      },
      {$unwind: "$subscribersList"},

      {$project: {
        subscriberList: {
          username: "$subscribersList.username",
          avtar: "$subscribersLIst.avtar",
          fullName: "$subscribersList.fullName"
        }
      }}

    ])

    return res.status(200).json(new ApiResponse(200, subscribersLIst, "subscribers list fetch successfully.."))
      
  })


  export const getSubscriberChannels = asyncHandlerPromises ( async (req, res) => {
    const {subscriberId} = req.params;

    
    if(!subscriberId){
      throw new ApiError(400, "subscriber id is not found...");
    }

    const channelList = await Subscription.aggregate([
      {
        $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId)
      }
      },

      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channelList"
        }
      },
      {$unwind: "$channelList"},

      {$project: {
        subscriberList: {
          username: "$channelList.username",
          avtar: "$channelList.avtar",
          fullName: "$channelList.fullName",
          coverImage: "channelList.coverImage"
        }
      }}

    ])

    return res.status(200).json(new ApiResponse(200, channelLIst, "channel list fetch successfully.."))
      



  })