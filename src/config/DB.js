
import mongoose from "mongoose"
import { Db_name } from "../constants.js";



export const DBconnect = async () => {

    const MongoURL = `${process.env.MONGO_URL}/${Db_name}`;
    if(!MongoURL){
      console.log("Error in MongoDb URL")
    }

  try {
    const ConnectedInstance = await mongoose.connect(MongoURL);

    console.log("DataBase Connect with Instance"+ ConnectedInstance.connection.host);
    
  } catch (err) {
    console.log("DB Connection Failed" + err);
    process.exit(1)
  }
};