import { Router } from "express";
import { getVideoComments } from "../Controller/comment.controller.js";




export const Commentrouter = Router();


Commentrouter.get("/:videoId", getVideoComments)