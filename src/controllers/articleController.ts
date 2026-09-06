import { Request, Response } from "express";
import pool from "../config/db.js";
import { RowDataPacket } from "mysql2";

interface Article extends RowDataPacket {
    id: number;
    title: string;
    body: string;
    category: string;
    submitted_by: number;
    created_at: Date;
}

export async function getArticles(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute<Article[]>(
            `SELECT id, title, body, category, submitted_by, created_at
            FROM articles
            ORDER BY created_at DESC`
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}


export async function createArticle(req: Request, res: Response) {
    const { title, body, category } = req.body;

    if (
        typeof title !== "string" ||
        typeof body !== "string" ||
        typeof category !== "string" ||
        !title.trim() ||
        !body.trim() ||
        !category.trim()
    ) {
        return res.status(400).json({
            message: "Title, body and category are required",
        });
    }

    if (title.trim().length > 255) {
        return res.status(400).json({
            message: "Title must be 255 characters or less",
        });
    }

    if (category.trim().length > 100) {
        return res.status(400).json({
            message: "Category must be 100 characters or less",
        });
    }

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        await pool.execute(
            `INSERT INTO articles (title, body, category, submitted_by)
            VALUES (?, ?, ?, ?)`,
            [title.trim(), body.trim(), category.trim(), req.user.id]
        );

        return res.status(201).json({
            message: "Article created successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}
