import mongoose from "mongoose";
import { asyncHandlerPromises } from "../utils/asyncHandler";
import { Video } from "../models/Video.model.js";
import {Like } from "../models/Video.model.js";



export const getChannelStats = asyncHandlerPromises( async(req, res)=>{


    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    //need channel or userId - req.user._id match with current user
    //perfom lookup between user and video and match the user_id in 
    //perfom lookup betwwen user and subscribers as well
    //total video count..
    //total Likes also need to perfom lookup 


    await Video.aggregate([
        {$match: {
            owner: new mongoose.Types.ObjectId(req.user._id)
        }},
        {
            $group: {
                $id: null,
                totalViews: {$sum: "$views"},
            }
        },

        {$count: "totalVideos"},

        {$lookup: {
            from: "subscriptions",
            localField: "owner",
            foreignField: "channel",
            as: "totalSubscriberCount"
        }},

        {$lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes"
        }},

        {$addFields: {
            totalLikes: {$size: "$likes"}
        }}

    ])


})