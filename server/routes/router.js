import express from "express";
import rogersPassRouter from "./rogersPass.js";
import grandTetonRouter from "./grandTeton.js";
const router = express.Router();

router.use("/rogerspass", rogersPassRouter);
router.use("/grandteton", grandTetonRouter);

export default router;
