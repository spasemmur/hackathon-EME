const Goal = require('../models/Goal');

// Получить все цели пользователя
exports.getGoals = async (req, res) => {
    try {
        const userId = req.user.id;

        const goals = await Goal.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            goals
        });
    } catch (error) {
        console.error('Ошибка при получении целей:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Создать цель
exports.createGoal = async (req, res) => {
    try {
        const { title, icon, target_value, deadline } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Название цели обязательно' });
        }

        const goal = await Goal.create({
            user_id: userId,
            title,
            icon: icon || '🎯',
            target_value,
            current_value: 0,
            progress: 0,
            deadline
        });

        res.status(201).json({
            success: true,
            message: 'Цель создана',
            goal
        });
    } catch (error) {
        console.error('Ошибка при создании цели:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Обновить прогресс цели
exports.updateGoalProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { current_value } = req.body;
        const userId = req.user.id;

        const goal = await Goal.findOne({
            where: { id, user_id: userId }
        });

        if (!goal) {
            return res.status(404).json({ message: 'Цель не найдена' });
        }

        const progress = goal.target_value
            ? Math.min(100, Math.round((current_value / goal.target_value) * 100))
            : current_value;

        await goal.update({
            current_value,
            progress
        });

        res.json({
            success: true,
            message: 'Прогресс обновлен',
            goal
        });
    } catch (error) {
        console.error('Ошибка при обновлении цели:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удалить цель
exports.deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const goal = await Goal.findOne({
            where: { id, user_id: userId }
        });

        if (!goal) {
            return res.status(404).json({ message: 'Цель не найдена' });
        }

        await goal.destroy();

        res.json({
            success: true,
            message: 'Цель удалена'
        });
    } catch (error) {
        console.error('Ошибка при удалении цели:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};