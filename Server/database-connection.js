require('dotenv').config();
const mysql = require("mysql2/promise");

// Создаем пул соединений
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Функция для мгновенной проверки связи
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ База данных MySQL успешно подключена!");
        connection.release();
    } catch (error) {
        console.error("❌ Ошибка в файле db.js:", error.message);
    }
};

testConnection();

// Экспортируем pool, чтобы использовать его в app.js
module.exports = pool;