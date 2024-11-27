import express from "express";
import rogersPassReport from "../controllers/rogersPassReport.js";
const rogersPassRouter = express.Router();

rogersPassRouter.get("/report", rogersPassReport);

rogersPassRouter.get("/forecast", (req, res) => {
  res.send("forecast page");
});

rogersPassRouter.get("/avyMap", (req, res) => {
  res.send("avy map page");
});

export default rogersPassRouter;
