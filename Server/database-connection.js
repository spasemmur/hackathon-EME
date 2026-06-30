const { Sequelize } = require('sequelize');
require('dotenv').config();

// Создаем подключение через Sequelize
// Мы берем данные из .env, чтобы не «светить» их в коде
const sequelize = new Sequelize(
    process.env.DB_NAME || 'taskTracker_db',
    process.env.DB_USER || 'klounada',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // Чтобы не засорять консоль SQL-запросами
    }
);

// Функция для проверки связи (современный способ Sequelize)
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ База данных MySQL успешно подключена через Sequelize!');
    } catch (error) {
        console.error('❌ Ошибка подключения к базе:', error.message);
    }
};

testConnection();

// Экспортируем только одну переменную - sequelize
module.exports = sequelize;