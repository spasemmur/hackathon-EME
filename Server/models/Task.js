const { DataTypes } = require('sequelize');
const sequelize = require('../database-connection');
const User = require('./User');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        defaultValue: 'Общее',
    },
    priority: {
        type: DataTypes.ENUM('низкий', 'средний', 'высокий'),
        defaultValue: 'средний',
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Связь с User
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Task;