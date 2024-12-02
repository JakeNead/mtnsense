import express from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import cors from "cors";
import sanitizeHtml from "sanitize-html";
import router from "./routes/router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// fix cors issue in prod!!!
app.use(cors());
// fix cors issue in prod!!!

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
