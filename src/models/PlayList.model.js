import mongoose, { mongo } from "mongoose";

const playListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    videos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const PlayList = mongoose.model("Playlist", playListSchema)
