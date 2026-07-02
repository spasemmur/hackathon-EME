const Task = require('../models/Task');

// Получить все задачи пользователя
exports.getTasks = async (req, res) => {
    try {
        const { filter, category, priority } = req.query;
        const userId = req.user.id;

        let where = { user_id: userId };

        // Фильтры
        if (filter === 'active') {
            where.is_completed = false;
        } else if (filter === 'completed') {
            where.is_completed = true;
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        if (priority && priority !== 'all') {
            where.priority = priority;
        }

        const tasks = await Task.findAll({
            where,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error('Ошибка при получении задач:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Создать задачу
exports.createTask = async (req, res) => {
    console.log('📥 POST /api/tasks:', req.body);
    console.log('👤 User ID:', req.user?.id);

    try {
        const { title, description, category, priority, due_date } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Название задачи обязательно' });
        }

        const task = await Task.create({
            user_id: userId,
            title,
            description: description || null,
            category: category || 'Общее',
            priority: priority || 'средний',
            due_date: due_date || null,
            progress: 0,
            is_completed: false
        });

        console.log('✅ Задача создана:', task.id);

        res.status(201).json({
            success: true,
            message: 'Задача создана',
            task
        });
    } catch (error) {
        console.error('❌ Ошибка в createTask:', error);
        console.error('❌ Stack:', error.stack);
        res.status(500).json({
            message: 'Ошибка сервера',
            error: error.message
        });
    }
};

// Обновить задачу
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, priority, due_date, progress, is_completed } = req.body;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: { id, user_id: userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Задача не найдена' });
        }

        await task.update({
            title: title || task.title,
            description: description !== undefined ? description : task.description,
            category: category || task.category,
            priority: priority || task.priority,
            due_date: due_date || task.due_date,
            progress: progress !== undefined ? progress : task.progress,
            is_completed: is_completed !== undefined ? is_completed : task.is_completed,
            completed_at: is_completed ? new Date() : null
        });

        res.json({
            success: true,
            message: 'Задача обновлена',
            task
        });
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удалить задачу
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: { id, user_id: userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Задача не найдена' });
        }

        await task.destroy();

        res.json({
            success: true,
            message: 'Задача удалена'
        });
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Переключить статус задачи
exports.toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = await Task.findOne({
            where: { id, user_id: userId }
        });

        if (!task) {
            return res.status(404).json({ message: 'Задача не найдена' });
        }

        const is_completed = !task.is_completed;
        await task.update({
            is_completed,
            progress: is_completed ? 100 : task.progress,
            completed_at: is_completed ? new Date() : null
        });

        res.json({
            success: true,
            message: `Задача ${is_completed ? 'выполнена' : 'активирована'}`,
            task
        });
    } catch (error) {
        console.error('Ошибка при переключении задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить статистику
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalTasks = await Task.count({ where: { user_id: userId } });
        const completedTasks = await Task.count({
            where: { user_id: userId, is_completed: true }
        });
        const activeTasks = totalTasks - completedTasks;
        const productivity = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        // Статистика по дням недели (последние 7 дней)
        const weeklyStats = await Task.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [require('sequelize').Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%w'), 'dayOfWeek'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['dayOfWeek'],
            raw: true
        });

        res.json({
            success: true,
            stats: {
                total: totalTasks,
                completed: completedTasks,
                active: activeTasks,
                productivity,
                weeklyStats
            }
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};