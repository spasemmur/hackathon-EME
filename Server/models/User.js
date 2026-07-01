const { DataTypes } = require('sequelize');
const sequelize = require('../database-connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickname: {
        type: DataTypes.STRING(50),
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sex: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
    },
    birthdate: {
        type: DataTypes.DATEONLY,
    },
    // ✅ Добавляем поле date_created
    date_created: {
        type: DataTypes.DATE,
        field: 'date_created', // Точное имя колонки в БД
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

module.exports = User;