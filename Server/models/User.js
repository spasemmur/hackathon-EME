const { DataTypes } = require('sequelize');
const sequelize = require('../database-connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255), // Bcrypt создаст длинную строку, поэтому 255
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    birthdate: {
        type: DataTypes.DATEONLY, // Формат YYYY-MM-DD
    },
    sex: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0, // 0 - не указан, 1 - муж, 2 - жен
    }
}, {
    tableName: 'users', // Точное имя таблицы в MySQL
    timestamps: false,  // Если в таблице нет колонок createdAt и updatedAt
    hooks: {
        // Хешируем пароль перед сохранением (как pre-save в Mongoose)
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

module.exports = User;