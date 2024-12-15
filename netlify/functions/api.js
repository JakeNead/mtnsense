// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("What up World!"));

api.use("/api/", router);

export const handler = serverless(api);

// import serverless from "serverless-http";
// import app from "../../server/server.js";

// export const handler = serverless(app);
