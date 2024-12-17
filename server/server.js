import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: ["http://localhost:5173", "https://mtnsense-forecasts.netlify.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", router);

if (process.env.VITE_MODE !== "production") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
