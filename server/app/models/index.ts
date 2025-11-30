import { url } from "../config/db_config.js";
import { Article } from "./article.js";
import { Service } from "./service.js";
import { ServiceType } from "./service_type.js";
import { User } from "./user.js"
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export const db = {
    mongoose,
    url,
    User,
    ServiceType,
    Service,
    Article
};
