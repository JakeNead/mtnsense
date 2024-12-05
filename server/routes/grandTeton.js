import express from "express";
import grandTetonReport from "../controllers/grandTeton/grandTetonReport.js";
import grandTetonForecast from "../controllers/grandTeton/grandTetonForecast.js";
const grandTetonRouter = express.Router();

grandTetonRouter.get("/report", grandTetonReport);

grandTetonRouter.get("/forecast", grandTetonForecast);

export default grandTetonRouter;
