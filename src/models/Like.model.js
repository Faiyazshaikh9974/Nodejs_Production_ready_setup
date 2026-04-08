import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
  {
    likedBy: {
      type: String,
      required: true,
    },

    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },

    tweet: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
  },
  {
    timestamps: true,
  },
);

export const Like = mongoose.model("Like", likeSchema);
