const { DataTypes } = require('sequelize');
const sequelize = require('../database-connection');
const User = require('./User');

const Goal = sequelize.define('Goal', {
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
    icon: {
        type: DataTypes.STRING(50),
        defaultValue: '🎯',
    },
    target_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }
}, {
    tableName: 'goals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Связь с User
User.hasMany(Goal, { foreignKey: 'user_id', as: 'goals' });
Goal.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Goal;