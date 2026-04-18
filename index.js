import "dotenv/config";
import cookieParser from "cookie-parser";
import { DBconnect } from "./src/config/DB.js";
import express from "express";
import cors from "cors";
import {router } from "./src/routes/user.route.js"
import { Commentrouter } from "./src/routes/comment.route.js";
import { LikeRouter } from "./src/routes/like.route.js";
const app = express();
const Port = process.env.PORT || 4000;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  }),
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({extended:true, limit: "116kb"}))

app.use(express.static("public"))

app.use(cookieParser());


app.use("/api/v1/user", router);

app.use("/api/v1/comments", Commentrouter)

app.use("/like", LikeRouter );



DBconnect().then(() => {
  app.listen(Port, () => {
    console.log(`app is listing on port ${Port}`);
  });
}).catch((err) => {
  console.log("Failed to connect to database:", err);
  process.exit(1);
});
