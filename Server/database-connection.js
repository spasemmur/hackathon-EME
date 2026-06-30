const { Sequelize } = require('sequelize');
require('dotenv').config(); // Чтобы работали переменные из .env

const sequelize = new Sequelize('taskTracker_db', 'klounada', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Отключаем лишний спам в консоли
});

// Проверка связи
sequelize.authenticate()
    .then(() => console.log('✅ База данных MySQL успешно подключена!'))
    .catch(err => console.error('❌ Ошибка подключения к базе:', err));

module.exports = sequelize;

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