import express from "express";
import revelstokeReport from "../controllers/revelstokeReport.js";
const revelstokeRouter = express.Router();

revelstokeRouter.get("/report", revelstokeReport);

revelstokeRouter.get("/forecast", (req, res) => {
  res.send("forecast page");
});

revelstokeRouter.get("/avyMap", (req, res) => {
  res.send("avy map page");
});

export default revelstokeRouter;
