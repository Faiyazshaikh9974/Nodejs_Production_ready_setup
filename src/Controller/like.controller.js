import mongoose from "mongoose";
import {Like} from "../models/Like.model.js";
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

})




export const toggleCommentLike = asyncHandlerPromises( async (req, res) => {
    const {commentId} = req.params;

    const commentObjId = new mongoose.Types.ObjectId(commentId);

    const exitingLike = await Like.findOne({LikedBy: req.user._id, comment: commentObjId})

    if(exitingLike){
        await Like.findByIdAndDelete(exitingLike._id);
    }else{
        await Like.create({
            LikedBy: req.user._id,
            comment: commentObjId
        })

        res.status(200).json(new ApiResponse(200, null, "Comment Liked"))
    }
})


export const toggleTweetLike = asyncHandlerPromises( async (req, res) => {
    const {tweetId} = req.params;

    const tweetObjId = new mongoose.Types.ObjectId(tweetId);

    const exitingLike = await Like.findOne({LikedBy: req.user._id, comment: commentObjId})

    if(exitingLike){
        await Like.findByIdAndDelete(exitingLike._id);
    }else{
        await Like.create({
            LikedBy: req.user._id,
            tweet: tweetObjId
        })

        res.status(200).json(new ApiResponse(200, null, "tweet Liked"))
    }
})

export const getAllLikedVideos = asyncHandlerPromises ( async (req, res) =>{
    

})