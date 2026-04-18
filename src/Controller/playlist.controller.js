import mongoose from "mongoose";
import { PlayList } from "../models/PlayList.model";
import { asyncHandlerPromises } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

export const createPlayList = asyncHandlerPromises(async (req, res) => {
  //so what data u need to create a playList - Look at the PlayListModel

  //u need name, description, videoId, OwnerId or UserId

  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "PlayList name is required");
  }

  if (!description) {
    throw new ApiError(400, "PlayList description is required");
  }

  const playList = await PlayList.create({
    name: name,
    description: description,
    videos: [],
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "PlayList successFully Created.."));
});

export const getUserPlayLists = asyncHandlerPromises(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User Id is missing..");
  }

  const userPlayLists = await PlayList.find({
    owner: userId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPlayLists,
        "user playlist fetched successfully..",
      ),
    );
});

export const getPlayListById = asyncHandlerPromises ( async (req, res) => {
    const {palyListId} = req.params;

    if(!playListId){
        throw new ApiError(400, "playList Id is missing...")
    }

    const playList = await PlayList.findOneById(playListId);

    return res.status(200).json( new ApiResponse(200, playList, "PlayList fetched successfully..."))
})

export const addVideoToPlayList = asyncHandlerPromises( async( req, res)=> {
    
})
