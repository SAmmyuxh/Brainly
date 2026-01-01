import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import AuthRouter from "./Routes/Authrouter";
import ContentRouter from "./Routes/Contentrouter";
import { connectDB } from "./DB/db";

dotenv.config();

const app = express();
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

// ✅ Read frontend URL from env
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);


app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

connectDB();

app.use("/api/v1", AuthRouter);
app.use("/api/v1", ContentRouter);

app.listen(PORT, () => {
  console.log(`🚀 App is listening on port ${PORT}`);
});
