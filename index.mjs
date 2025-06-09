import express from "express"
import morgan from "morgan"
import apiRouter from "./src/routes/apiRoute.mjs"
import cors from 'cors'
const app = express();

app.set('trust proxy', true);

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Authorization');
  next();
});

app.use(cors({
  origin: '*', // Or your frontend URL for better security
  exposedHeaders: [
    'Authorization', 
    'X-Auth-Token',
    'X-Message',
    'Content-Disposition'
  ]
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static('uploads'));

app.use("/api/", apiRouter)

export default app;