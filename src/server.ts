import express from "express";

const app = express();
const PORT: number = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Development Platforms API is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});