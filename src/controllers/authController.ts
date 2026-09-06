import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";


export async function registerUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.length > 255) {
        return res.status(400).json({
            message: "Email must be 255 characters or less"
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
        return res.status(400).json({
            message: "Please provide a valid email address",
        });
    }

    if (password.length > 128) {
        return res.status(400).json({
            message: "Password must be 128 characters or less",
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            [normalizedEmail, passwordHash]
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
    
    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const [rows] = await pool.execute<UserRow[]>(
            "SELECT id, email, password_hash FROM users WHERE email = ?",
            [normalizedEmail]
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

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}
