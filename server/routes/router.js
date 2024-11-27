import express from "express";
import revelstokeRouter from "./revelstoke.js";
const router = express.Router();

router.use("/revelstoke", revelstokeRouter);

export default router;
