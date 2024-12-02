import express from "express";
import rogersPassReport from "../controllers/rogersPassReport.js";
import rogersPassForecast from "../controllers/rogersPassForecast.js";
const rogersPassRouter = express.Router();

rogersPassRouter.get("/report", rogersPassReport);

rogersPassRouter.get("/forecast", rogersPassForecast);

rogersPassRouter.get("/avyMap", (req, res) => {
  res.send("avy map page");
});

export default rogersPassRouter;
