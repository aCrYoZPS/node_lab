import { url } from "../config/db_config.js";
import { User } from "./user.js"
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export const db = {
    mongoose,
    url,
    User
};
