import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { RowDataPacket } from "mysql2";


export async function registerUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Please provide a valid email address",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long",
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            [email, passwordHash]
        );

        return res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}


interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
}


export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    try {
        const [rows] = await pool.execute<UserRow[]>(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = rows[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(200).json({
            message: "Login successful",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}
