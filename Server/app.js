const cors = require("cors");
const express = require('express');
const apiRouter = require('./routes/index');
const taskRoutes = require('./routes/tasks');
const goalRoutes = require('./routes/goals');

// ✅ 1. СНАЧАЛА создаём app
const app = express();

// ✅ 2. ПОТОМ middleware (должны быть ДО роутов)
app.use(express.json());
app.use(cors());

// ✅ 3. ПОТОМ роуты
app.use('/api', apiRouter); // Базовые роуты (auth и т.д.)
app.use('/api/tasks', taskRoutes); // Задачи
app.use('/api/goals', goalRoutes); // Цели

// ✅ 4. В конце запуск сервера
app.listen(3001, () => console.log('Server started on port 3001')); 