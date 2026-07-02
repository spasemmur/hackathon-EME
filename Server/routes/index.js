const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
// const taskRoutes = require('./tasks'); // пример на будущее

// Собираем всё под свои префиксы
router.use('/auth', authRoutes);
// router.use('/tasks', taskRoutes);

module.exports = router;