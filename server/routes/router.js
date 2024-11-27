import express from "express";
import rogersPassRouter from "./rogersPass.js";
const router = express.Router();

router.use("/rogersPass", rogersPassRouter);

export default router;
