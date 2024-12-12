import express from "express";
import rogersPassReport from "../controllers/rogersPass/rogersPassReport.js";
import rogersPassForecast from "../controllers/rogersPass/rogersPassForecast.js";
import rogersPassAvy from "../controllers/rogersPass/rogersPassAvy.js";
const rogersPassRouter = express.Router();

rogersPassRouter.get("/report", rogersPassReport);

rogersPassRouter.get("/forecast", rogersPassForecast);

rogersPassRouter.get("/avy", rogersPassAvy);

export default rogersPassRouter;
