import mongoose, { mongo, Types } from "mongoose";

const orderSchema = new mongoose.Schema({
    brandName: {
        type: String,
        require : true,
    },
    price: {
        type: Number,
        min: 20,
    },
    orderdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
}, {timestamps:true})


export const Order = mongoose.model("Order", orderSchema);