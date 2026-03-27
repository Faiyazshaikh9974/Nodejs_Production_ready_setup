import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      require: true,
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: String,
      default: Date.UTC(),
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);
