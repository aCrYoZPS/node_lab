import dotenv from "dotenv"
dotenv.config()

import express from "express";
import cors from "cors";
import { userRouter } from "./app/routers/user_router.js";
import { db } from "./app/models/index.js";
import { errorHandlingMiddleware, loggingMiddleware, authMiddleware } from "./app/middlewares/index.js";
import { authRouter } from "./app/routers/auth_router.js";
import { serviceTypeRouter } from "./app/routers/service_type_router.js";
import { serviceRouter } from "./app/routers/service_router.js";
import { articleRouter } from "./app/routers/article_router.js";
import { vacancyRouter } from "./app/routers/vacancy_router.js";

db.mongoose
    .connect(db.url)
    .catch((err: any) => {
        console.log(`DB connection failed with exception ${err}.\nAborting.`);
        process.exit(1);
    });

const app = express();
app.use(loggingMiddleware);

app.use(cors({
    origin: "http://localhost:8081"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/articles", articleRouter);
app.use("/auth", authRouter);
app.use("/services", serviceRouter);
app.use("/service_types", serviceTypeRouter);
app.use("/vacancies", vacancyRouter)

app.use(authMiddleware)
app.use("/users", userRouter);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
