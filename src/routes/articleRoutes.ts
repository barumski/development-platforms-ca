import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getArticles, createArticle } from "../controllers/articleController.js";

const router = Router();

router.get("/", getArticles);
router.post("/", authenticateToken, createArticle);

export default router;