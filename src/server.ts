import app from "./app.js";
import pool from "./config/db.js";

const PORT: number = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("Connected to MySQL");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MySQL:", error);
        process.exit(1);
    }
}

startServer();

