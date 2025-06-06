import express from "express"
import morgan from "morgan"
import apiRouter from "./src/routes/apiRoute.mjs"

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/", apiRouter)

export default app;