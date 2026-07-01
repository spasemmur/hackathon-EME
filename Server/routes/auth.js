const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// На самом деле путь будет /api/auth/register
router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/me', authMiddleware, (req, res) => {
    // Благодаря мидлвейру, мы уже на 100% знаем, что юзер залогинен
    res.json({
        message: "Доступ разрешен!",
        userId: req.user.id
    });
});
module.exports = router;