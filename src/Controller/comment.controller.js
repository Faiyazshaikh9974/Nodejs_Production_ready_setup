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
        video: videoObjectId,
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

export const addComment = asyncHandlerPromises(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required to add comment..");
  }

  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(404, "VideoId is not found in params");
  }

  const videoObjectId = new mongoose.Types.ObjectId(videoId);

  const savedComment = await Comment.create({
    content: content,
    owner: req.user._id,
    video: videoObjectId,
  });

  if (!savedComment) {
    throw new ApiError(500, "Unable to add comment..");
  }

  res
    .status(201)
    .json(new ApiResponse(201, savedComment, "Comment added successfully.."));
});

export const updateComment = asyncHandlerPromises(async (req, res) => {
  const { commentId } = req.params;
  const {content} = req.body;

  if (commentId) {
    throw new ApiError(400, "CommentId is Empty");
  }

  const exitingComment = await Comment.findOneById(commentId);

  if (exitingComment.owner != req.user._id) {
    throw new ApiError(400, "Access Denied you can't edit the comment");
  }

  const updatedCommnet = await Comment.findByIdAndUpdate({ id: commentId }, {content: content}, { new: true });

  if(!updatedCommnet){
    throw new ApiError(500, "Unable to update the comment");
  }

  res.status(200).json(new ApiResponse(200, updatedCommnet, "Comment updated successfully.."));
  //update existing Comment,
  //only owner of the comment can update,
  //find comment by id and update,
  //
});

export const deleteComment = asyncHandlerPromises(async (req, res) => {
  const { commentId } = req.params;

  if (commentId) {
    throw new ApiError(400, "CommentId is Empty");
  }

  const exitingComment = await Comment.findOneById(commentId);

  if (exitingComment.owner != req.user._id) {
    throw new ApiError(400, "Access Denied you can't delete the comment");
  }

    const deletedComment = await Comment.findByIdAndDelete({ id: commentId });

    if(!deletedComment){
      throw new ApiError(500, "Unable to delete the comment");
    }

    res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted successfully.."));

  //find comment by id,
  //check if the comment exist or not,
  //only owner of the comment can delete,
  //delete the comment,
  //return response,


});
