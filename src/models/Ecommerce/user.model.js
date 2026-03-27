import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: [true, "Username is required"],
        minLength: 5,
        unique: true
    },
    email: {
        type: String,
        require: [true, "email is required"],
        unique: true
    },

    password: {
        type: String,
        require: true,
    }
    

}, {timestamps: true})



export const User = mongoose.model("User", userSchema);