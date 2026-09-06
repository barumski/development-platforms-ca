import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Development Platforms API is running",
    });
});

app.use("/auth", authRoutes);

export default app;