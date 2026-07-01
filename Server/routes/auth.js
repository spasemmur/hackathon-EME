const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User'); // ✅ Добавь импорт модели

// На самом деле путь будет /api/auth/register
router.post('/register', authController.register);

router.post('/login', authController.login);

// ✅ ИСПРАВЛЕННЫЙ РОУТ /me
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Благодаря мидлвейру, мы уже на 100% знаем, что юзер залогинен
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nickname', 'email']
        });

        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json({
            message: "Доступ разрешен!",
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Ошибка в /me:', error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;