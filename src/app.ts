import express from "express";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Development Platforms API is running",
    });
});

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.use(errorHandler);

export default app;