import "./app/config/env.js";
import express from "express";
import cors from "cors";
import { userRouter } from "./app/routers/user_router.js";
import { errorHandlingMiddleware, loggingMiddleware, authMiddleware } from "./app/middlewares/index.js";
import { authRouter } from "./app/routers/auth_router.js";
import { serviceTypeRouter } from "./app/routers/service_type_router.js";
import { serviceRouter } from "./app/routers/service_router.js";
import { articleRouter } from "./app/routers/article_router.js";
import { vacancyRouter } from "./app/routers/vacancy_router.js";
import { aiRouter } from "./app/routers/ai_router.js";
import passport from "passport";

import { db } from "./app/models/index.js";
db.mongoose
    .connect(db.url)
    .catch((err: any) => {
        console.log(`DB connection failed with exception ${err}.\nAborting.`);
        process.exit(1);
    });

import "./app/config/passport.js"

const app = express();
app.use(loggingMiddleware);

app.use(cors({
    origin: "http://localhost:8081"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/articles", articleRouter);
app.use("/services", serviceRouter);
app.use("/service_types", serviceTypeRouter);
app.use("/vacancies", vacancyRouter)
app.use("/ai", aiRouter);

app.use(authMiddleware)
app.use("/users", userRouter);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
