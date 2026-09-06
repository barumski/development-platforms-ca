import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication token is required",
        });
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        req.user = {
            id: decoded.userId,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}