const express = require("express");
const cors = require("cors");
const db = require("./database-connection")

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Сервер работает" });
});

// Пример использования базы в маршруте
app.get("/api/test-db", async (req, res) => {
    try {
        // Используем переменную db, которую импортировали выше
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        res.json({ status: "Base is OK", data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/registration", (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({
            success: false,
            message: "Заполните логин и пароль"
        });
    }

    if (login === "student" && password === "summer2026") {
        return res.json({
            success: true,
            message: "Проверка пройдена, всё супер!",
            user: login
        });
    }

    return res.status(401).json({
        success: false,
        message: "Логин или пароль введены неверно"
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});