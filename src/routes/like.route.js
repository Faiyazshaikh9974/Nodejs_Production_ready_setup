import { Router } from "express";
import { getAllLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../Controller/like.controller";

export const LikeRouter = Router();

LikeRouter.post("/:videoId", toggleVideoLike);

LikeRouter.post("/:tweetId", toggleTweetLike);

LikeRouter.post("/:commentId", toggleCommentLike);

LikeRouter.get("/all", getAllLikedVideos);

