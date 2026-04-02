import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
  },
  {
    timestaps: true,
  },
);


export const Comment = mongoose.Model("Comment", commentSchema) ;