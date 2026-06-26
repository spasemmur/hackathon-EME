const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/main", (req, res) => {
    res.json({ message: "Сервер работает" });
});

app.post("/api/registration", (req, res) => {
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