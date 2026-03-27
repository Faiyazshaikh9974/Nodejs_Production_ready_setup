//this middleware verify the user if user exist or not...

import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandlerPromises } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandlerPromises(async(req, _, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError(401, "Unauthorized Request..")
        }
    
        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // console.log(decodedTokenInfo)
    
        const dbUser = await User.findById(decodedTokenInfo?.id).select("-password -refreshToken");
    
    
        if(!dbUser) {
            //Todo about front end
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = dbUser;
    
        next();
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid access Token")
        
    }


})