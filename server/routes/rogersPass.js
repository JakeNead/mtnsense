import express from "express";
import rogersPassReport from "../controllers/rogersPass/rogersPassReport.js";
import rogersPassForecast from "../controllers/rogersPass/rogersPassForecast.js";
const rogersPassRouter = express.Router();

rogersPassRouter.get("/report", rogersPassReport);

rogersPassRouter.get("/forecast", rogersPassForecast);

export default rogersPassRouter;
